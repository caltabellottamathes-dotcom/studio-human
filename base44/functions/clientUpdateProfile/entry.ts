import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'client') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const sr = base44.asServiceRole;
    const clientId = user.id; // Always from auth

    // Find client's profile
    const profiles = await sr.entities.ClientProfile.filter({ user_id: clientId });

    // Security: only allow updating safe fields — admin_notes, status, user_id are server-controlled
    const safeFields = {
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      phone: body.phone,
      address: body.address,
      postal_code: body.postal_code,
      city: body.city,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
      emergency_contact_relation: body.emergency_contact_relation
    };

    let saved;
    if (profiles.length > 0) {
      saved = await sr.entities.ClientProfile.update(profiles[0].id, safeFields);
    } else {
      saved = await sr.entities.ClientProfile.create({
        user_id: clientId,
        ...safeFields,
        consent_date: new Date().toISOString().split('T')[0],
        intake_date: new Date().toISOString().split('T')[0]
      });
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: 'profile_updated', entity_type: 'ClientProfile', entity_id: saved.id,
      details: 'Client updated their own profile'
    });

    return Response.json({ profile: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});