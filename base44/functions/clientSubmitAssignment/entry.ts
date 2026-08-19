import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'client') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    if (!body.assignment_id || !body.content || !body.content.trim()) {
      return Response.json({ error: 'assignment_id and content required' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const clientId = user.id; // Always from auth

    // Security: verify this assignment actually belongs to this client
    const assignments = await sr.entities.Assignment.filter({ id: body.assignment_id, client_id: clientId });
    if (assignments.length === 0) {
      return Response.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check for existing submission
    const existing = await sr.entities.AssignmentSubmission.filter({ assignment_id: body.assignment_id, client_id: clientId });

    let saved;
    if (existing.length > 0) {
      saved = await sr.entities.AssignmentSubmission.update(existing[0].id, {
        content: body.content.trim(),
        submitted_date: new Date().toISOString().split('T')[0]
      });
    } else {
      saved = await sr.entities.AssignmentSubmission.create({
        assignment_id: body.assignment_id,
        client_id: clientId,
        content: body.content.trim(),
        submitted_date: new Date().toISOString().split('T')[0]
      });
    }

    // Update assignment status
    await sr.entities.Assignment.update(body.assignment_id, { status: 'submitted' });

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: 'assignment_submitted', entity_type: 'AssignmentSubmission', entity_id: saved.id,
      details: `Client submitted assignment: ${assignments[0].title}`
    });

    return Response.json({ submission: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});