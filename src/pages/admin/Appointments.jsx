import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AppointmentFormDialog from '@/components/admin/AppointmentFormDialog';
import { Plus, Clock } from 'lucide-react';
import { ErrorState } from '@/components/ListStates';

const aptTypeLabel = { intake: 'Intake', session: 'Session', online: 'Online', physical: 'In-person', phone: 'Phone' };

export default function AdminAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [dialog, setDialog] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('adminGetAppointments', {});
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Schedule</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const appointments = (data?.appointments || []).filter(a => filter === 'all' || a.status === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Schedule</h1>
        </div>
        <button onClick={() => setDialog(true)} className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-body transition-colors">
          <Plus className="w-4 h-4" strokeWidth={1.5} /> New appointment
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-colors ${filter === f.id ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400 font-light">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.map(a => (
            <div key={a.id} className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase text-red-600 leading-none">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-sm font-display text-red-700 leading-none mt-0.5">{new Date(a.date).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-800 font-medium truncate">{a.client_name}</p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {a.start_time} · {a.duration_minutes} min · {aptTypeLabel[a.type] || a.type}</p>
                </div>
              </div>
              <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0 ${
                a.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                'bg-neutral-100 text-neutral-400'
              }`}>{a.status === 'scheduled' ? 'Scheduled' : a.status === 'completed' ? 'Completed' : 'Cancelled'}</span>
            </div>
          ))}
        </div>
      )}

      {dialog && (
        <AppointmentFormDialog
          open
          onClose={() => setDialog(false)}
          client={{ user_id: '', first_name: '', last_name: '' }}
          clients={data?.clients || []}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}