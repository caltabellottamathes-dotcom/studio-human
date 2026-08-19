import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.role !== 'client') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.content || !body.content.trim()) {
      return Response.json({ error: 'content required' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const clientId = user.role === 'client' ? user.id : body.client_id;
    const clientName = user.role === 'client' ? (user.full_name || '') : (body.client_name || '');
    const sender = user.role === 'client' ? 'client' : 'admin';

    if (!clientId) return Response.json({ error: 'client_id required' }, { status: 400 });

    const message = await sr.entities.Message.create({
      client_id: clientId,
      client_name: clientName,
      sender,
      sender_id: user.id,
      content: body.content.trim(),
      read: false
    });

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: 'message_sent', entity_type: 'Message', entity_id: message.id,
      details: `${sender === 'admin' ? 'Admin' : 'Client'} sent message to ${sender === 'admin' ? clientName : 'admin'}`
    });

    return Response.json({ message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});