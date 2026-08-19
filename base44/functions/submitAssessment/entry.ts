import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const answers = body.answers || [];

    const questions = await base44.asServiceRole.entities.AssessmentQuestion.filter(
      { is_active: true },
      'order',
      100
    );
    const profiles = await base44.asServiceRole.entities.AssessmentProfile.filter(
      { is_active: true },
      'priority',
      50
    );

    // Build lookup: questionId -> parsed answers array
    const questionMap = {};
    for (const q of questions) {
      let parsed = [];
      try { parsed = JSON.parse(q.answers || '[]'); } catch (_) { parsed = []; }
      questionMap[q.id] = parsed;
    }

    // Calculate profile scores
    const scores = {};
    const answersSummary = [];

    for (const ans of answers) {
      const qAnswers = questionMap[ans.questionId];
      if (!qAnswers) continue;
      const selectedTexts = [];
      for (const idx of (ans.selectedIndices || [])) {
        const a = qAnswers[idx];
        if (!a) continue;
        selectedTexts.push(a.text);
        if (a.profile_weights) {
          for (const [key, weight] of Object.entries(a.profile_weights)) {
            scores[key] = (scores[key] || 0) + weight;
          }
        }
      }
      answersSummary.push(selectedTexts.join(', '));
    }

    // Find best-matching profile
    let bestProfile = null;
    let bestScore = -1;

    for (const p of profiles) {
      const score = scores[p.profile_key] || 0;
      if (score > bestScore) {
        bestScore = score;
        bestProfile = p;
      } else if (score === bestScore && bestProfile && p.priority < bestProfile.priority) {
        bestProfile = p;
      }
    }

    // Fallback if no scores
    if (!bestProfile || bestScore <= 0) {
      bestProfile = profiles.find(p => p.profile_key === 'not_alone') || profiles[0] || null;
    }

    // Save anonymous completion
    if (bestProfile) {
      const today = new Date().toISOString().split('T')[0];
      await base44.asServiceRole.entities.AssessmentCompletion.create({
        profile_key: bestProfile.profile_key,
        answers_summary: JSON.stringify(answersSummary),
        completed_date: today
      });
    }

    if (!bestProfile) {
      return Response.json({ error: 'No profiles configured' }, { status: 500 });
    }

    return Response.json({
      profile: {
        profile_key: bestProfile.profile_key,
        title: bestProfile.title,
        reflection: bestProfile.reflection,
        recognition: bestProfile.recognition,
        encouragement: bestProfile.encouragement,
        how_debora_helps: bestProfile.how_debora_helps,
        invitation: bestProfile.invitation,
        related_slug: bestProfile.related_slug
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});