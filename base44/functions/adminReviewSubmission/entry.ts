import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const body = await req.json();
    if (!body.assignment_id || !body.client_id) {
      return Response.json({ error: 'assignment_id and client_id required' }, { status: 400 });
    }

    const sr = base44.asServiceRole;

    // Find the submission for this assignment + client
    const submissions = await sr.entities.AssignmentSubmission.filter({
      assignment_id: body.assignment_id,
      client_id: body.client_id
    });

    if (submissions.length === 0) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = submissions[0];
    const updated = await sr.entities.AssignmentSubmission.update(submission.id, {
      admin_feedback: (body.admin_feedback || '').trim(),
      status: 'reviewed'
    });

    // Mark the assignment as reviewed
    await sr.entities.Assignment.update(body.assignment_id, { status: 'reviewed' });

    await sr.entities.AuditLog.create({
      actor_id: user.id,
      actor_name: user.full_name || user.email,
      actor_role: user.role,
      action: 'assignment_reviewed',
      entity_type: 'AssignmentSubmission',
      entity_id: submission.id,
      details: `Admin reviewed assignment ${body.assignment_id} for client ${body.client_id}`
    });

    return Response.json({ submission: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});