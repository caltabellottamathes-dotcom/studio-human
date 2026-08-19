import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });

    const body = await req.json();
    const sr = base44.asServiceRole;
    const appId = Deno.env.get("BASE44_APP_ID");
    const serverUrl = req.headers.get("Base44-Api-Url") || "https://base44.app";

    // Create a new client with login credentials (no email sent to client)
    if (body.action === 'create') {
      if (!body.email || !body.password) {
        return Response.json({ error: 'E-mailadres en wachtwoord zijn verplicht' }, { status: 400 });
      }
      if (!body.first_name || !body.last_name) {
        return Response.json({ error: 'Voor- en achternaam zijn verplicht' }, { status: 400 });
      }

      // Check if user already exists
      const existing = await sr.entities.User.filter({ email: body.email });
      if (existing.length > 0) {
        return Response.json({ error: 'Er bestaat al een account met dit e-mailadres' }, { status: 409 });
      }

      // Register the user via the auth API (creates an unverified user + sends OTP email,
      // but we verify them server-side so the client can log in immediately with admin-set password)
      const regRes = await fetch(`${serverUrl}/api/apps/${appId}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: body.email, password: body.password })
      });

      if (!regRes.ok) {
        const errBody = await regRes.json().catch(() => ({}));
        return Response.json({ error: errBody.detail || errBody.message || 'Registratie mislukt' }, { status: regRes.status });
      }

      // Fetch the newly created user
      const users = await sr.entities.User.filter({ email: body.email });
      if (users.length === 0) {
        return Response.json({ error: 'Gebruiker aangemaakt maar niet gevonden' }, { status: 500 });
      }
      const newUser = users[0];

      // Set the user as verified and assign client role
      await sr.entities.User.update(newUser.id, { is_verified: true, role: 'client' });

      // Create ClientProfile
      const profile = await sr.entities.ClientProfile.create({
        user_id: newUser.id,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        address: body.address,
        postal_code: body.postal_code,
        city: body.city,
        date_of_birth: body.date_of_birth,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        emergency_contact_relation: body.emergency_contact_relation,
        status: 'active',
        consent_date: new Date().toISOString().split('T')[0],
        intake_date: new Date().toISOString().split('T')[0],
        admin_notes: body.admin_notes
      });

      await sr.entities.AuditLog.create({
        actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
        action: 'client_created', entity_type: 'ClientProfile', entity_id: profile.id,
        details: `Admin created client: ${body.first_name} ${body.last_name} (${body.email})`
      });

      return Response.json({ success: true, profile, userId: newUser.id });
    }

    // Verify client OTP (step 2 of creation)
    if (body.action === 'verify') {
      if (!body.email || !body.otpCode) {
        return Response.json({ error: 'E-mailadres en verificatiecode zijn verplicht' }, { status: 400 });
      }
      const verifyRes = await fetch(`${serverUrl}/api/apps/${appId}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: body.email, otp_code: body.otpCode })
      });
      if (!verifyRes.ok) {
        const errBody = await verifyRes.json().catch(() => ({}));
        return Response.json({ error: errBody.detail || errBody.message || 'Verificatiecode ongeldig' }, { status: verifyRes.status });
      }
      await sr.entities.AuditLog.create({
        actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
        action: 'client_verified', entity_type: 'User',
        details: `Admin verified client email: ${body.email}`
      });
      return Response.json({ success: true, message: 'Cliënt geverifieerd' });
    }

    // Archive a client
    if (body.action === 'archive') {
      const updated = await sr.entities.ClientProfile.update(body.id, { status: 'archived' });
      await sr.entities.AuditLog.create({
        actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
        action: 'client_archived', entity_type: 'ClientProfile', entity_id: body.id,
        details: `Admin archived client: ${body.first_name} ${body.last_name}`
      });
      return Response.json({ profile: updated });
    }

    // Save / update client profile
    const fields = {
      user_id: body.user_id,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      phone: body.phone,
      address: body.address,
      postal_code: body.postal_code,
      city: body.city,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
      emergency_contact_relation: body.emergency_contact_relation,
      status: body.status || 'active',
      admin_notes: body.admin_notes
    };

    let saved;
    if (body.id) {
      saved = await sr.entities.ClientProfile.update(body.id, fields);
    } else {
      const existingProfile = await sr.entities.ClientProfile.filter({ user_id: body.user_id });
      if (existingProfile.length > 0) {
        saved = await sr.entities.ClientProfile.update(existingProfile[0].id, fields);
      } else {
        saved = await sr.entities.ClientProfile.create({
          ...fields,
          consent_date: new Date().toISOString().split('T')[0],
          intake_date: new Date().toISOString().split('T')[0]
        });
      }
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: body.id ? 'client_updated' : 'client_created',
      entity_type: 'ClientProfile', entity_id: saved.id,
      details: `Admin ${body.id ? 'updated' : 'created'} client: ${body.first_name} ${body.last_name}`
    });

    return Response.json({ profile: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});