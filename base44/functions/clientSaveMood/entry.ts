import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'client') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    if (!body.mood_score || !body.entry_date) {
      return Response.json({ error: 'mood_score and entry_date required' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const clientId = user.id; // Always derived from auth — never from request body

    // Check if entry already exists for this date (one per day)
    const existing = await sr.entities.MoodEntry.filter({ client_id: clientId, entry_date: body.entry_date });

    let saved;
    if (existing.length > 0) {
      saved = await sr.entities.MoodEntry.update(existing[0].id, {
        mood_score: body.mood_score,
        mood_label: body.mood_label || '',
        note: body.note || ''
      });
    } else {
      saved = await sr.entities.MoodEntry.create({
        client_id: clientId,
        mood_score: body.mood_score,
        mood_label: body.mood_label || '',
        note: body.note || '',
        entry_date: body.entry_date
      });
    }

    await sr.entities.AuditLog.create({
      actor_id: user.id, actor_name: user.full_name || user.email, actor_role: user.role,
      action: 'mood_entry_saved', entity_type: 'MoodEntry', entity_id: saved.id,
      details: `Client saved mood: score ${body.mood_score} on ${body.entry_date}`
    });

    return Response.json({ entry: saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});