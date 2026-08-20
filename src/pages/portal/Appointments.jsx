import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';

const aptTypeLabel = { intake: 'Intake session', session: 'Session', online: 'Online session', physical: 'In-person session', phone: 'Phone call' };

export default function PortalAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('getClientPortalData', {});
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const all = data?.appointments || [];
  const upcoming = all.filter(a => a.status === 'scheduled' && a.date >= today).sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const past = all.filter(a => !(a.status === 'scheduled' && a.date >= today)).sort((a, b) => b.date.localeCompare(a.date));

  const AppointmentCard = ({ a }) => (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-start gap-4">
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
        <div className="mt-2">
          {a.status === 'scheduled' && <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Scheduled</span>}
          {a.status === 'completed' && <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Completed</span>}
          {a.status === 'cancelled' && <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-400 flex items-center gap-1"><X className="w-3 h-3" /> Cancelled</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Appointments</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">An overview of your scheduled and past appointments.</p>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <h2 className="font-display text-lg text-neutral-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-600" strokeWidth={1.5} /> Upcoming
          </h2>
          {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <p className="text-sm text-neutral-400 font-light">No upcoming appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(a => <AppointmentCard key={a.id} a={a} />)}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="font-display text-lg text-neutral-800 mb-4">History</h2>
          <div className="space-y-3">
            {past.map(a => <AppointmentCard key={a.id} a={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}