import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const body = await req.json();
    const sr = base44.asServiceRole;

    if (!body.client_id || !body.title || !body.file_url) {
      return Response.json({ error: 'client_id, title and file_url required' }, { status: 400 });
    }

    const doc = await sr.entities.SharedDocument.create({
      client_id: body.client_id,
      title: body.title,
      file_url: body.file_url,
      file_type: body.file_type || '',
      description: body.description || '',
      category: body.category || 'other',
      visible_to_client: body.visible_to_client !== false,
      uploaded_by: user.id
    });

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: 'document_shared', entity_type: 'SharedDocument', entity_id: doc.id,
      details: `Admin shared document "${body.title}" with ${body.client_name || body.client_id}`
    });

    return Response.json({ document: doc });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});