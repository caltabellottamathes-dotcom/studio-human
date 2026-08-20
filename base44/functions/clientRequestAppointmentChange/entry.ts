import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'client') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    if (!body.appointment_id || !body.request_type) {
      return Response.json({ error: 'appointment_id and request_type required' }, { status: 400 });
    }
    if (!['cancel', 'reschedule'].includes(body.request_type)) {
      return Response.json({ error: 'request_type must be cancel or reschedule' }, { status: 400 });
    }

    const sr = base44.asServiceRole;

    // Verify the appointment belongs to this client and is still scheduled
    const appts = await sr.entities.Appointment.filter({ id: body.appointment_id, client_id: user.id });
    if (appts.length === 0) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }
    if (appts[0].status !== 'scheduled') {
      return Response.json({ error: 'This appointment can no longer be changed' }, { status: 400 });
    }

    const updated = await sr.entities.Appointment.update(body.appointment_id, {
      client_request: body.request_type,
      client_request_note: (body.note || '').trim()
    });

    await sr.entities.AuditLog.create({
      actor_id: user.id,
      actor_name: user.full_name || user.email,
      actor_role: user.role,
      action: 'appointment_change_requested',
      entity_type: 'Appointment',
      entity_id: body.appointment_id,
      details: `Client requested ${body.request_type} for appointment ${body.appointment_id}`
    });

    return Response.json({ appointment: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});