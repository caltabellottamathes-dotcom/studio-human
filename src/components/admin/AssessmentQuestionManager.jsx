import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import AssessmentQuestionEditor from './AssessmentQuestionEditor';

export default function AssessmentQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [q, p] = await Promise.all([
        base44.entities.AssessmentQuestion.list('order', 100),
        base44.entities.AssessmentProfile.list('priority', 50)
      ]);
      setQuestions(q);
      setProfiles(p);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await base44.entities.AssessmentQuestion.delete(id);
    fetchData();
  };

  const move = async (q, dir) => {
    const newOrder = q.order + dir;
    await base44.entities.AssessmentQuestion.update(q.id, { order: newOrder });
    const adjacent = questions.find(x => x.order === newOrder);
    if (adjacent) await base44.entities.AssessmentQuestion.update(adjacent.id, { order: q.order });
    fetchData();
  };

  if (loading)
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-neutral-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setEditing(null); setEditorOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-body transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New question
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {questions.length === 0 ? (
          <div className="p-12 text-center"><p className="text-sm text-neutral-400">No questions yet.</p></div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {questions.map((q, i) => {
              let answerCount = 0;
              try { answerCount = JSON.parse(q.answers || '[]').length; } catch (_) {}
              return (
                <div key={q.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(q, -1)} disabled={i === 0} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => move(q, 1)} disabled={i === questions.length - 1} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 truncate">{q.question_text}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {q.question_type === 'single' ? 'Single choice' : 'Multiple choice'} · {answerCount} answers
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(q); setEditorOpen(true); }} className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editorOpen && (
        <AssessmentQuestionEditor
          open={editorOpen}
          question={editing}
          profiles={profiles}
          maxOrder={questions.length}
          onClose={() => setEditorOpen(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}