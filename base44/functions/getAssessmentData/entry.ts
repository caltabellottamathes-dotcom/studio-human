import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const questions = await base44.asServiceRole.entities.AssessmentQuestion.filter(
      { is_active: true },
      'order',
      100
    );

    const publicQuestions = questions.map(q => {
      let parsed = [];
      try { parsed = JSON.parse(q.answers || '[]'); } catch (_) { parsed = []; }
      return {
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        order: q.order,
        answers: parsed.map(a => ({ text: a.text }))
      };
    });

    return Response.json({ questions: publicQuestions });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});