import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const body = await req.json();
    const clientId = body.client_user_id;
    if (!clientId) return Response.json({ error: 'client_user_id required' }, { status: 400 });

    const sr = base44.asServiceRole;

    const [clientUser, profiles, appointments, sessionNotes, assignments, documents, messages, moodEntries, questionnaires, invoices] = await Promise.all([
      sr.entities.User.get(clientId),
      sr.entities.ClientProfile.filter({ user_id: clientId }),
      sr.entities.Appointment.filter({ client_id: clientId }),
      sr.entities.SessionNote.filter({ client_id: clientId }),
      sr.entities.Assignment.filter({ client_id: clientId }),
      sr.entities.SharedDocument.filter({ client_id: clientId }),
      sr.entities.Message.filter({ client_id: clientId }),
      sr.entities.MoodEntry.filter({ client_id: clientId }),
      sr.entities.Questionnaire.filter({ client_id: clientId }),
      sr.entities.Invoice.filter({ client_id: clientId })
    ]);

    await sr.entities.AuditLog.create({
      actor_id: user.id,
      actor_name: user.full_name || user.email,
      actor_role: user.role,
      action: 'client_detail_viewed',
      entity_type: 'ClientProfile',
      entity_id: clientId,
      details: `Admin viewed client: ${clientUser?.full_name || clientUser?.email || clientId}`
    });

    return Response.json({
      user: clientUser,
      profile: profiles[0] || null,
      appointments: appointments.sort((a, b) => b.date.localeCompare(a.date)),
      sessionNotes: sessionNotes.sort((a, b) => b.session_date.localeCompare(a.session_date)),
      assignments,
      documents,
      messages: messages.sort((a, b) => a.created_date.localeCompare(b.created_date)),
      moodEntries: moodEntries.sort((a, b) => b.entry_date.localeCompare(a.entry_date)),
      questionnaires,
      invoices
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});