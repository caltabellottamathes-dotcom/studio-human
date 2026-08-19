import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'client' && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: insufficient role' }, { status: 403 });
    }

    const sr = base44.asServiceRole;
    const clientId = user.id;

    const [profile, appointments, documents, assignments, messages, moodEntries, questionnaires, invoices] = await Promise.all([
      sr.entities.ClientProfile.filter({ user_id: clientId }),
      sr.entities.Appointment.filter({ client_id: clientId }),
      sr.entities.SharedDocument.filter({ client_id: clientId, visible_to_client: true }),
      sr.entities.Assignment.filter({ client_id: clientId }),
      sr.entities.Message.filter({ client_id: clientId }),
      sr.entities.MoodEntry.filter({ client_id: clientId }),
      sr.entities.Questionnaire.filter({ client_id: clientId }),
      sr.entities.Invoice.filter({ client_id: clientId })
    ]);

    // Audit log — record data access
    await sr.entities.AuditLog.create({
      actor_id: user.id,
      actor_name: user.full_name || user.email,
      actor_role: user.role,
      action: 'portal_data_accessed',
      entity_type: 'ClientProfile',
      entity_id: clientId,
      details: 'Client accessed their portal dashboard'
    });

    // Auto-create ClientProfile on first portal login
    let profileData = profile[0] ? { ...profile[0] } : null;
    if (!profileData && user.role === 'client') {
      const newProfile = await sr.entities.ClientProfile.create({
        user_id: clientId,
        first_name: user.full_name?.split(' ')[0] || '',
        last_name: user.full_name?.split(' ').slice(1).join(' ') || '',
        consent_date: new Date().toISOString().split('T')[0],
        intake_date: new Date().toISOString().split('T')[0]
      });
      profileData = { ...newProfile };
    }
    // Security: strip admin_notes — never expose private admin notes to clients
    if (profileData) delete profileData.admin_notes;

    return Response.json({
      user,
      profile: profileData,
      appointments,
      documents,
      assignments,
      messages,
      moodEntries,
      questionnaires,
      invoices
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});