import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, Save, Clock } from 'lucide-react';

export default function AssignmentReviewPanel({ assignment, submission, client, onSaved }) {
  const [feedback, setFeedback] = useState(submission?.admin_feedback || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!submission) return null;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminReviewSubmission', {
        assignment_id: assignment.id,
        client_id: client.user_id,
        admin_feedback: feedback
      });
      onSaved();
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const reviewed = submission.status === 'reviewed' || assignment.status === 'reviewed';

  return (
    <div className="mt-3 pl-4 border-l-2 border-neutral-100 space-y-3">
      <div className="bg-neutral-50 rounded-lg p-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1 flex items-center gap-1">
          <Check className="w-3 h-3" /> Client submission
        </p>
        <p className="text-sm text-neutral-700 font-light whitespace-pre-wrap">{submission.content}</p>
        {submission.submitted_date && (
          <p className="text-[10px] text-neutral-400 mt-2">
            Submitted {new Date(submission.submitted_date).toLocaleDateString('en-US')}
          </p>
        )}
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1 block">
          Your feedback {reviewed && <span className="text-emerald-600 normal-case">(reviewed)</span>}
        </label>
        <Textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={3}
          placeholder="Write your feedback to the client..."
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={saving} className="bg-neutral-900 hover:bg-black text-xs h-8">
          {saving ? <><Clock className="w-3 h-3 animate-spin" /> Saving...</> : <><Save className="w-3 h-3" /> Save review</>}
        </Button>
        {reviewed && !saving && (
          <span className="text-[10px] text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <Check className="w-3 h-3" /> Reviewed
          </span>
        )}
      </div>
    </div>
  );
}