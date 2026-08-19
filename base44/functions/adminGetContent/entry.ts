import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const sr = base44.asServiceRole;

    const [sessionNotes, assignments, messages, clientProfiles] = await Promise.all([
      sr.entities.SessionNote.list('-session_date', 50),
      sr.entities.Assignment.list('-created_date', 50),
      sr.entities.Message.list('-created_date', 200),
      sr.entities.ClientProfile.filter({})
    ]);

    const clientMap = {};
    clientProfiles.forEach(c => {
      clientMap[c.user_id] = `${c.first_name} ${c.last_name}`.trim();
    });

    return Response.json({
      sessionNotes: sessionNotes.map(n => ({ ...n, client_display_name: n.client_name || clientMap[n.client_id] || 'Onbekend' })),
      assignments: assignments.map(a => ({ ...a, client_display_name: a.client_name || clientMap[a.client_id] || 'Onbekend' })),
      messages: messages.map(m => ({ ...m, client_display_name: m.client_name || clientMap[m.client_id] || 'Onbekend' })),
      clients: clientProfiles.map(c => ({ user_id: c.user_id, name: `${c.first_name} ${c.last_name}`.trim(), status: c.status }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});