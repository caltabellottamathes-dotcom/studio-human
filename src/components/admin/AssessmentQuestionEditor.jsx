import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

export default function AssessmentQuestionEditor({ open, question, profiles, maxOrder, onClose, onSaved }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('single');
  const [answers, setAnswers] = useState([{ text: '', profile_weights: {} }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (question) {
      setText(question.question_text);
      setType(question.question_type);
      try {
        const parsed = JSON.parse(question.answers || '[]');
        setAnswers(parsed.length > 0 ? parsed : [{ text: '', profile_weights: {} }]);
      } catch { setAnswers([{ text: '', profile_weights: {} }]); }
    } else {
      setText('');
      setType('single');
      setAnswers([{ text: '', profile_weights: {} }]);
    }
  }, [question, open]);

  const updateAnswerText = (i, val) =>
    setAnswers(prev => prev.map((a, idx) => idx === i ? { ...a, text: val } : a));

  const updateWeight = (ai, key, val) =>
    setAnswers(prev => prev.map((a, idx) => idx === ai ? { ...a, profile_weights: { ...a.profile_weights, [key]: val } } : a));

  const addAnswer = () => setAnswers(prev => [...prev, { text: '', profile_weights: {} }]);
  const removeAnswer = (i) => setAnswers(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanAnswers = answers
        .filter(a => a.text.trim())
        .map(a => ({
          text: a.text.trim(),
          profile_weights: Object.fromEntries(
            Object.entries(a.profile_weights || {}).filter(([, v]) => v > 0)
          )
        }));
      const data = {
        question_text: text.trim(),
        question_type: type,
        order: question?.order ?? maxOrder + 1,
        is_active: true,
        answers: JSON.stringify(cleanAnswers)
      };
      if (question) await base44.entities.AssessmentQuestion.update(question.id, data);
      else await base44.entities.AssessmentQuestion.create(data);
      onSaved();
      onClose();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit question' : 'New question'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Type the question..."
            />
          </div>
          <div className="space-y-2">
            <Label>Answer type</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('single')}
                className={`px-4 py-2 rounded-md text-xs uppercase tracking-widest transition-colors ${type === 'single' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}
              >Single choice</button>
              <button
                onClick={() => setType('multiple')}
                className={`px-4 py-2 rounded-md text-xs uppercase tracking-widest transition-colors ${type === 'multiple' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}
              >Multiple choice</button>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Answers & weights</Label>
            {answers.map((answer, ai) => (
              <div key={ai} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Input
                    value={answer.text}
                    onChange={e => updateAnswerText(ai, e.target.value)}
                    placeholder="Answer text..."
                    className="flex-1"
                  />
                  {answers.length > 1 && (
                    <button onClick={() => removeAnswer(ai)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 pl-1">
                  {profiles.map(p => (
                    <div key={p.profile_key} className="flex items-center gap-2">
                      <label className="text-[10px] text-neutral-500 truncate flex-1 uppercase tracking-wide">
                        {p.profile_key.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={answer.profile_weights?.[p.profile_key] || ''}
                        onChange={e => updateWeight(ai, p.profile_key, parseInt(e.target.value) || 0)}
                        className="w-12 text-center rounded border border-neutral-200 px-1 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
             onClick={addAnswer}
             className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
             <Plus className="w-3 h-3" /> Add answer
            </button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !text.trim()}>
            {saving ? 'Saving...' : 'Save question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}