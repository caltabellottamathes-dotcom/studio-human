import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, MapPin, Check, X, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ListStates';

const aptTypeLabel = { intake: 'Intake session', session: 'Session', online: 'Online session', physical: 'In-person session', phone: 'Phone call' };

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
        note: requestNote
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
  const upcoming = all.filter(a => a.status === 'scheduled' && a.date >= today).sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const past = all.filter(a => !(a.status === 'scheduled' && a.date >= today)).sort((a, b) => b.date.localeCompare(a.date));

  const AppointmentCard = ({ a }) => (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-red-50 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-[9px] uppercase text-red-600 leading-none">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-base font-display text-red-700 leading-none mt-0.5">{new Date(a.date).getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-800 font-medium">{aptTypeLabel[a.type] || a.type}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {a.start_time} · {a.duration_minutes} min</span>
            {a.location && <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.location}</span>}
          </div>
          {a.client_visible_notes && <p className="text-xs text-neutral-500 mt-2 font-light bg-neutral-50 rounded-lg p-3">{a.client_visible_notes}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 ${
              a.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
              a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
              'bg-neutral-100 text-neutral-400'
            }`}>
              {a.status === 'scheduled' && <Check className="w-3 h-3" />}
              {a.status === 'completed' && <Check className="w-3 h-3" />}
              {a.status === 'cancelled' && <X className="w-3 h-3" />}
              {a.status === 'scheduled' ? 'Scheduled' : a.status === 'completed' ? 'Completed' : 'Cancelled'}
            </span>
            {a.client_request && a.client_request !== 'none' && (
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {a.client_request === 'cancel' ? 'Cancel requested' : 'Reschedule requested'}
              </span>
            )}
          </div>
        </div>
      </div>
      {a.status === 'scheduled' && (!a.client_request || a.client_request === 'none') && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex gap-2">
          <button
            onClick={() => { setRequestDialog({ id: a.id, type: 'reschedule' }); setRequestNote(''); }}
            className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
          >
            Request to reschedule
          </button>
          <span className="text-neutral-200">·</span>
          <button
            onClick={() => { setRequestDialog({ id: a.id, type: 'cancel' }); setRequestNote(''); }}
            className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
          >
            Request to cancel
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Appointments</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">An overview of your scheduled and past appointments.</p>
      </div>

      {loading ? (
        <LoadingSkeleton lines={2} />
      ) : error ? (
        <ErrorState onRetry={fetchData} />
      ) : (
        <>
          <div className="mb-8">
            <h2 className="font-display text-lg text-neutral-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" strokeWidth={1.5} /> Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={Calendar} title="No upcoming appointments." />
            ) : (
              <div className="space-y-3">
                {upcoming.map(a => <AppointmentCard key={a.id} a={a} />)}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-neutral-800 mb-4">History</h2>
              <div className="space-y-3">
                {past.map(a => <AppointmentCard key={a.id} a={a} />)}
              </div>
            </div>
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
          <p className="text-sm text-neutral-500">
            {requestDialog?.type === 'cancel'
              ? 'Your counselor will be notified and will follow up to confirm the cancellation.'
              : 'Your counselor will be notified and will reach out to arrange a new time.'}
          </p>
          <Textarea
            value={requestNote}
            onChange={e => setRequestNote(e.target.value)}
            rows={3}
            placeholder="Add a note (optional)..."
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRequestDialog(null)} className="flex-1">Cancel</Button>
            <Button onClick={submitRequest} disabled={submitting} className="flex-1 bg-neutral-900 hover:bg-black">
              {submitting ? 'Sending...' : 'Send request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}