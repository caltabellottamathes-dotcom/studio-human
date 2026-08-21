import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClipboardList, ChevronDown, Check, Clock } from 'lucide-react';
import FadeSection from '@/components/FadeSection';
import SectionShell from '@/components/admin/SectionShell';
import PortalPageHeader from '@/components/portal/PortalPageHeader';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import { ErrorState } from '@/components/ListStates';

const typeLabel = { homework: 'Homework', reflection: 'Reflection', exercise: 'Exercise', reading: 'Reading' };
const statusLabel = { assigned: 'Assigned', in_progress: 'In progress', submitted: 'Submitted', reviewed: 'Reviewed' };
const statusChip = {
  assigned: 'bg-sky-100 text-sky-700',
  in_progress: 'bg-amber-50 text-amber-700',
  submitted: 'bg-red-50 text-red-700',
  reviewed: 'bg-emerald-50 text-emerald-700',
};

const ease = [0.25, 0.1, 0.25, 1];

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="bg-neutral-50 px-5 py-7 md:px-6 md:py-9">
      <Icon className="w-4 h-4 text-red-600/70 mb-3" strokeWidth={1.5} />
      <p className="font-display text-3xl md:text-4xl text-neutral-800 leading-none tabular-nums">
        <AnimatedCounter to={value} duration={1.2} />
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-2">{label}</p>
    </div>
  );
}

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
        content: submissionText,
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
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[64rem]">
        <PortalPageHeader label="Client Portal" title="Assignments" />
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const submissions = data?.submissions || [];
  const submissionsByAssignment = {};
  submissions.forEach((s) => { submissionsByAssignment[s.assignment_id] = s; });

  const assignments = (data?.assignments || []).sort((a, b) => {
    if (a.status !== 'reviewed' && b.status === 'reviewed') return -1;
    if (a.status === 'reviewed' && b.status !== 'reviewed') return 1;
    return (b.created_date || '').localeCompare(a.created_date || '');
  });

  const openCount = assignments.filter((a) => a.status === 'assigned' || a.status === 'in_progress').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const reviewedCount = assignments.filter((a) => a.status === 'reviewed').length;

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[64rem]">
      <PortalPageHeader label="Client Portal" title="Assignments" sub="Your homework and reflection assignments." />

      <div className="grid grid-cols-3 gap-px bg-neutral-200 border-y border-neutral-200 rounded-[1.5rem] overflow-hidden mb-8">
        <MiniStat label="Open" value={openCount} icon={ClipboardList} />
        <MiniStat label="Submitted" value={submittedCount} icon={Clock} />
        <MiniStat label="Reviewed" value={reviewedCount} icon={Check} />
      </div>

      {assignments.length === 0 ? (
        <FadeSection>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ClipboardList className="w-8 h-8 text-neutral-300" strokeWidth={1} />
            <p className="font-display text-lg text-neutral-700">No assignments yet</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Maya will assign work here</p>
          </div>
        </FadeSection>
      ) : (
        <FadeSection>
          <SectionShell title="Your assignments" label="Tasks" sub="">
            <ul className="space-y-2.5">
              {assignments.map((a) => {
                const isOpen = expanded === a.id;
                return (
                  <li key={a.id} className="border border-neutral-200/70 rounded-[1rem] overflow-hidden bg-white/40">
                    <button
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <p className="font-display text-lg text-neutral-800">{a.title}</p>
                          <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full ${statusChip[a.status] || ''}`}>
                            {statusLabel[a.status] || a.status}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-3 flex-wrap">
                          <span>{typeLabel[a.type] || a.type}</span>
                          {a.due_date && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </p>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease }} className="flex-shrink-0 text-neutral-400">
                        <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-4 border-t border-neutral-100 pt-4">
                            {a.description && <p className="text-sm text-neutral-600 font-light leading-relaxed">{a.description}</p>}
                            {a.instructions && (
                              <div>
                                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">Instructions</p>
                                <p className="text-sm text-neutral-600 font-light whitespace-pre-wrap leading-relaxed">{a.instructions}</p>
                              </div>
                            )}

                            {a.status === 'submitted' || a.status === 'reviewed' ? (
                              <div className="space-y-3">
                                <div className="bg-emerald-50/60 rounded-xl p-4">
                                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-1.5 flex items-center gap-1.5">
                                    <Check className="w-3 h-3" /> Submitted
                                  </p>
                                  <p className="text-sm text-neutral-600 font-light">
                                    {a.status === 'reviewed' ? 'Maya has reviewed your submission.' : "Awaiting feedback from Maya."}
                                  </p>
                                </div>
                                {a.status === 'reviewed' && submissionsByAssignment[a.id]?.admin_feedback && (
                                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1.5">Feedback from Maya</p>
                                    <p className="text-sm text-neutral-700 font-light whitespace-pre-wrap leading-relaxed">{submissionsByAssignment[a.id].admin_feedback}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Button onClick={() => { setSubmitDialog(a); setSubmissionText(''); }} className="bg-red-600 hover:bg-red-700 text-red-50 rounded-full">
                                Submit assignment
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </SectionShell>
        </FadeSection>
      )}

      <Dialog open={!!submitDialog} onOpenChange={(v) => !v && setSubmitDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Submit assignment</DialogTitle>
            <p className="text-sm text-neutral-500 font-light">{submitDialog?.title}</p>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={6}
              placeholder="Write your answer or reflection..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSubmitDialog(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !submissionText.trim()} className="flex-1 bg-red-600 hover:bg-red-700 text-red-50">
                {submitting ? 'Sending...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}