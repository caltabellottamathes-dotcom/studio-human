import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const sr = base44.asServiceRole;

    const [users, clientProfiles, appointments, messages, sessionNotes, auditLogs] = await Promise.all([
      sr.entities.User.filter({ role: 'client' }),
      sr.entities.ClientProfile.filter({}),
      sr.entities.Appointment.filter({ status: 'scheduled' }),
      sr.entities.Message.filter({ sender: 'client', read: false }),
      sr.entities.SessionNote.list('-created_date', 5),
      sr.entities.AuditLog.list('-created_date', 20)
    ]);

    // Join profiles with user emails
    const clients = clientProfiles.map(profile => {
      const usr = users.find(u => u.id === profile.user_id);
      return {
        id: profile.id,
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: usr?.email || '',
        phone: profile.phone,
        status: profile.status,
        intake_date: profile.intake_date
      };
    });

    // Include invited users who haven't completed registration yet
    const usersWithoutProfiles = users
      .filter(u => !clientProfiles.some(p => p.user_id === u.id))
      .map(u => ({
        id: null,
        user_id: u.id,
        first_name: u.full_name?.split(' ')[0] || '',
        last_name: u.full_name?.split(' ').slice(1).join(' ') || '',
        email: u.email,
        phone: '',
        status: 'pending',
        intake_date: null
      }));

    const allClients = [...clients, ...usersWithoutProfiles];

    const upcomingAppointments = appointments
      .sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))
      .slice(0, 10);

    return Response.json({
      stats: {
        activeClients: clients.filter(c => c.status === 'active').length,
        totalClients: allClients.length,
        upcomingAppointments: appointments.length,
        unreadMessages: messages.length
      },
      clients: allClients,
      upcomingAppointments,
      unreadMessages: messages,
      recentSessionNotes: sessionNotes,
      recentActivity: auditLogs
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});