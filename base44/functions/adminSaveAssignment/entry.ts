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
      title: body.title,
      description: body.description || '',
      type: body.type || 'homework',
      instructions: body.instructions || '',
      due_date: body.due_date || '',
      status: body.status || 'assigned'
    };

    if (!fields.client_id || !fields.title) {
      return Response.json({ error: 'client_id and title required' }, { status: 400 });
    }

    let saved;
    if (body.id) {
      saved = await sr.entities.Assignment.update(body.id, fields);
    } else {
      saved = await sr.entities.Assignment.create(fields);
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: body.id ? 'assignment_updated' : 'assignment_created',
      entity_type: 'Assignment', entity_id: saved.id,
      details: `Admin ${body.id ? 'updated' : 'created'} assignment "${body.title}" for ${body.client_name}`
    });

    return Response.json({ assignment: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});