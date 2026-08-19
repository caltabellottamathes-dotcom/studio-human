import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const sr = base44.asServiceRole;

    const [appointments, clientProfiles] = await Promise.all([
      sr.entities.Appointment.list('-date', 200),
      sr.entities.ClientProfile.filter({})
    ]);

    const clients = clientProfiles.map(c => ({
      user_id: c.user_id,
      name: `${c.first_name} ${c.last_name}`.trim(),
      status: c.status
    }));

    return Response.json({ appointments, clients });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});