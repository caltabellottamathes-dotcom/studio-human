import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Clock } from 'lucide-react';

const days = [
  { id: 1, label: 'Monday' }, { id: 2, label: 'Tuesday' }, { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' }, { id: 5, label: 'Friday' }, { id: 6, label: 'Saturday' }, { id: 0, label: 'Sunday' }
];

export default function AdminSettings() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({ day: 1, start: '09:00', end: '17:00' });

  const fetchData = async () => {
    try {
      const list = await base44.entities.Availability.list();
      setAvailability(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addSlot = async () => {
    try {
      await base44.entities.Availability.create({
        day_of_week: adding.day,
        start_time: adding.start,
        end_time: adding.end,
        is_available: true
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const removeSlot = async (id) => {
    try {
      await base44.entities.Availability.delete(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Settings</h1>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="font-display text-lg text-neutral-800 mb-4">Availability</h2>
        <div className="space-y-4">
          {days.map(day => {
            const slots = availability.filter(a => a.day_of_week === day.id);
            return (
              <div key={day.id} className="flex items-start gap-4 py-2 border-b border-neutral-100 last:border-0">
                <div className="w-24 flex-shrink-0">
                  <p className="text-sm text-neutral-700 font-medium">{day.label}</p>
                </div>
                <div className="flex-1 space-y-1">
                  {slots.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">Not available</p>
                  ) : (
                    slots.map(s => (
                      <div key={s.id} className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-1.5">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs text-neutral-600">{s.start_time} — {s.end_time}</span>
                        <button onClick={() => removeSlot(s.id)} className="ml-auto text-neutral-300 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add slot */}
        <div className="mt-6 pt-4 border-t border-neutral-100">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Add a time slot</p>
          <div className="flex flex-wrap items-center gap-2">
            <select value={adding.day} onChange={e => setAdding(a => ({ ...a, day: parseInt(e.target.value) }))} className="border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white">
              {days.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
            <input type="time" value={adding.start} onChange={e => setAdding(a => ({ ...a, start: e.target.value }))} className="border border-neutral-200 rounded-md px-3 py-2 text-sm" />
            <span className="text-neutral-400 text-sm">to</span>
            <input type="time" value={adding.end} onChange={e => setAdding(a => ({ ...a, end: e.target.value }))} className="border border-neutral-200 rounded-md px-3 py-2 text-sm" />
            <button onClick={addSlot} className="inline-flex items-center gap-1 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-md text-xs uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Practice info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-display text-lg text-neutral-800 mb-4">Practice details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-400 uppercase text-xs tracking-widest">Name</span>
            <span className="text-neutral-700">studioHuman — Maya Hartwell</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-400 uppercase text-xs tracking-widest">Address</span>
            <span className="text-neutral-700">14 Linden Walk, Portland</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-400 uppercase text-xs tracking-widest">Phone</span>
            <span className="text-neutral-700">+1 (503) 555 0142</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-neutral-400 uppercase text-xs tracking-widest">Email</span>
            <span className="text-neutral-700">hello@studiohuman.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}