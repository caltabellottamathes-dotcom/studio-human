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
      appointment_id: body.appointment_id || '',
      session_date: body.session_date,
      summary: body.summary || '',
      observations: body.observations || '',
      interventions: body.interventions || '',
      treatment_plan: body.treatment_plan || '',
      risk_assessment: body.risk_assessment || '',
      private_notes: body.private_notes || ''
    };

    if (!fields.client_id || !fields.session_date) {
      return Response.json({ error: 'client_id and session_date required' }, { status: 400 });
    }

    let saved;
    if (body.id) {
      saved = await sr.entities.SessionNote.update(body.id, fields);
    } else {
      saved = await sr.entities.SessionNote.create(fields);
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: body.id ? 'session_note_updated' : 'session_note_created',
      entity_type: 'SessionNote', entity_id: saved.id,
      details: `Admin ${body.id ? 'updated' : 'created'} session note for ${body.client_name}`
    });

    return Response.json({ note: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});