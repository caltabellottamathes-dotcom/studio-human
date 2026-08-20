import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClipboardList, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react';
import { ErrorState } from '@/components/ListStates';

const typeLabel = { homework: 'Homework', reflection: 'Reflection', exercise: 'Exercise', reading: 'Reading' };
const statusLabel = { assigned: 'Assigned', in_progress: 'In progress', submitted: 'Submitted', reviewed: 'Reviewed' };

export default function PortalAssignments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [submitDialog, setSubmitDialog] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!submissionText.trim() || !submitDialog) return;
    setSubmitting(true);
    try {
      await base44.functions.invoke('clientSubmitAssignment', {
        assignment_id: submitDialog.id,
        content: submissionText
      });
      setSubmissionText('');
      setSubmitDialog(null);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 max-w-4xl">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Assignments</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const submissions = data?.submissions || [];
  const submissionsByAssignment = {};
  submissions.forEach(s => { submissionsByAssignment[s.assignment_id] = s; });

  const assignments = (data?.assignments || []).sort((a, b) => {
    if (a.status !== 'reviewed' && b.status === 'reviewed') return -1;
    if (a.status === 'reviewed' && b.status !== 'reviewed') return 1;
    return (b.created_date || '').localeCompare(a.created_date || '');
  });

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Assignments</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">Your homework and reflection assignments.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <ClipboardList className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-neutral-400 font-light">No assignments have been given yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const isOpen = expanded === a.id;
            return (
              <div key={a.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : a.id)} className="w-full text-left p-5 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-neutral-800 font-medium">{a.title}</p>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        a.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                        a.status === 'submitted' ? 'bg-amber-50 text-amber-600' :
                        a.status === 'reviewed' ? 'bg-emerald-50 text-emerald-600' : ''
                      }`}>{statusLabel[a.status] || a.status}</span>
                    </div>
                    <p className="text-xs text-neutral-400">{typeLabel[a.type] || a.type}</p>
                    {a.due_date && <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {new Date(a.due_date).toLocaleDateString('en-US')}</p>}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-neutral-100 pt-4">
                    {a.description && <p className="text-sm text-neutral-600 font-light">{a.description}</p>}
                    {a.instructions && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Instructions</p>
                        <p className="text-sm text-neutral-600 font-light whitespace-pre-wrap">{a.instructions}</p>
                      </div>
                    )}
                    {a.status === 'submitted' || a.status === 'reviewed' ? (
                      <div className="space-y-3">
                        <div className="bg-emerald-50/50 rounded-lg p-4">
                          <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-1"><Check className="w-3 h-3" /> Submitted</p>
                          <p className="text-sm text-neutral-600 font-light">You've submitted this assignment. {a.status === 'reviewed' ? 'Maya has reviewed your submission.' : 'Awaiting feedback from Maya.'}</p>
                        </div>
                        {a.status === 'reviewed' && submissionsByAssignment[a.id]?.admin_feedback && (
                          <div className="bg-red-50/40 border border-red-100 rounded-lg p-4">
                            <p className="text-[10px] uppercase tracking-widest text-red-600 mb-1">Feedback from Maya</p>
                            <p className="text-sm text-neutral-700 font-light whitespace-pre-wrap">{submissionsByAssignment[a.id].admin_feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => { setSubmitDialog(a); setSubmissionText(''); }} className="bg-neutral-900 hover:bg-black">
                        Submit assignment
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!submitDialog} onOpenChange={(v) => !v && setSubmitDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Submit assignment</DialogTitle>
            <p className="text-sm text-neutral-500">{submitDialog?.title}</p>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={submissionText}
              onChange={e => setSubmissionText(e.target.value)}
              rows={6}
              placeholder="Write your answer or reflection..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSubmitDialog(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !submissionText.trim()} className="flex-1 bg-neutral-900 hover:bg-black">
                {submitting ? 'Sending...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}