import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, MapPin, Check, X, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FadeSection from '@/components/FadeSection';
import SectionShell from '@/components/admin/SectionShell';
import PortalPageHeader from '@/components/portal/PortalPageHeader';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ListStates';

const aptTypeLabel = { intake: 'Intake session', session: 'Session', online: 'Online session', physical: 'In-person session', phone: 'Phone call' };

const statusMeta = {
  scheduled: { label: 'Scheduled', cls: 'text-red-600', icon: Check },
  completed: { label: 'Completed', cls: 'text-emerald-600', icon: Check },
  cancelled: { label: 'Cancelled', cls: 'text-neutral-400', icon: X },
  no_show: { label: 'Missed', cls: 'text-neutral-400', icon: X },
};

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="bg-neutral-50 px-6 py-7 md:px-8 md:py-9">
      <Icon className="w-4 h-4 text-red-600/70 mb-3" strokeWidth={1.5} />
      <p className="font-display text-4xl md:text-5xl text-neutral-800 leading-none tabular-nums">
        <AnimatedCounter to={value} duration={1.2} />
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-2">{label}</p>
    </div>
  );
}

export default function PortalAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestDialog, setRequestDialog] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const submitRequest = async () => {
    if (!requestDialog) return;
    setSubmitting(true);
    try {
      await base44.functions.invoke('clientRequestAppointmentChange', {
        appointment_id: requestDialog.id,
        request_type: requestDialog.type,
        note: requestNote,
      });
      setRequestDialog(null);
      setRequestNote('');
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const all = data?.appointments || [];
  const upcoming = all.filter((a) => a.status === 'scheduled' && a.date >= today).sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const past = all.filter((a) => !(a.status === 'scheduled' && a.date >= today)).sort((a, b) => b.date.localeCompare(a.date));
  const completedCount = all.filter((a) => a.status === 'completed').length;

  const AppointmentRow = ({ a, isUpcoming }) => (
    <li className="flex items-start gap-5 py-5 border-b border-neutral-100 last:border-0">
      <div className="w-14 flex-shrink-0 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-red-600/70 block">
          {new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="font-display text-2xl text-neutral-800 leading-none tabular-nums">{new Date(a.date).getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-display text-lg text-neutral-800">{aptTypeLabel[a.type] || a.type}</p>
          {statusMeta[a.status] && (
            <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest ${statusMeta[a.status].cls}`}>
              {React.createElement(statusMeta[a.status].icon, { className: 'w-3 h-3' })}
              {statusMeta[a.status].label}
            </span>
          )}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 mt-1.5 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> {a.start_time} · {a.duration_minutes} min</span>
          {a.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {a.location}</span>}
        </p>
        {a.client_visible_notes && <p className="text-sm text-neutral-500 font-light mt-2 bg-neutral-50 rounded-xl p-3 leading-relaxed">{a.client_visible_notes}</p>}
        {a.client_request && a.client_request !== 'none' && (
          <span className="inline-flex items-center gap-1.5 mt-2 font-mono text-[9px] uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" /> {a.client_request === 'cancel' ? 'Cancel requested' : 'Reschedule requested'}
          </span>
        )}
        {isUpcoming && a.status === 'scheduled' && (!a.client_request || a.client_request === 'none') && (
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => { setRequestDialog({ id: a.id, type: 'reschedule' }); setRequestNote(''); }}
              className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
            >
              Request to reschedule
            </button>
            <span className="text-neutral-200">·</span>
            <button
              onClick={() => { setRequestDialog({ id: a.id, type: 'cancel' }); setRequestNote(''); }}
              className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
            >
              Request to cancel
            </button>
          </div>
        )}
      </div>
    </li>
  );

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[60rem]">
      <PortalPageHeader label="Client Portal" title="Appointments" sub="An overview of your scheduled and past appointments." />

      {loading ? (
        <LoadingSkeleton lines={2} />
      ) : error ? (
        <ErrorState onRetry={fetchData} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-px bg-neutral-200 border-y border-neutral-200 rounded-[1.5rem] overflow-hidden mb-8">
            <MiniStat label="Upcoming" value={upcoming.length} icon={Calendar} />
            <MiniStat label="Completed" value={completedCount} icon={Check} />
          </div>

          <FadeSection className="mb-8">
            <SectionShell title="Upcoming" label="Schedule" sub="">
              {upcoming.length === 0 ? (
                <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">No upcoming appointments.</p>
              ) : (
                <ul>{upcoming.map((a) => <AppointmentRow key={a.id} a={a} isUpcoming />)}</ul>
              )}
            </SectionShell>
          </FadeSection>

          {past.length > 0 && (
            <FadeSection>
              <SectionShell title="History" label="Past" sub="">
                <ul>{past.map((a) => <AppointmentRow key={a.id} a={a} />)}</ul>
              </SectionShell>
            </FadeSection>
          )}
        </>
      )}

      <Dialog open={!!requestDialog} onOpenChange={(v) => !v && setRequestDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {requestDialog?.type === 'cancel' ? 'Request to cancel' : 'Request to reschedule'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 font-light">
            {requestDialog?.type === 'cancel'
              ? 'Your counselor will be notified and will follow up to confirm the cancellation.'
              : 'Your counselor will be notified and will reach out to arrange a new time.'}
          </p>
          <Textarea
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            rows={3}
            placeholder="Add a note (optional)..."
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRequestDialog(null)} className="flex-1">Cancel</Button>
            <Button onClick={submitRequest} disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700 text-red-50">
              {submitting ? 'Sending...' : 'Send request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}