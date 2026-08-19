import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const body = await req.json();
    const sr = base44.asServiceRole;

    const fields = {
      client_id: body.client_id,
      client_name: body.client_name,
      date: body.date,
      start_time: body.start_time,
      duration_minutes: body.duration_minutes || 60,
      type: body.type || 'session',
      location: body.location || '',
      status: body.status || 'scheduled',
      client_visible_notes: body.client_visible_notes || '',
      price: body.price || 0
    };

    if (!fields.client_id || !fields.date || !fields.start_time) {
      return Response.json({ error: 'client_id, date and start_time required' }, { status: 400 });
    }

    let saved;
    if (body.id) {
      saved = await sr.entities.Appointment.update(body.id, fields);
    } else {
      saved = await sr.entities.Appointment.create(fields);
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: body.id ? 'appointment_updated' : 'appointment_created',
      entity_type: 'Appointment', entity_id: saved.id,
      details: `Admin ${body.id ? 'updated' : 'created'} appointment for ${body.client_name} on ${body.date}`
    });

    return Response.json({ appointment: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});