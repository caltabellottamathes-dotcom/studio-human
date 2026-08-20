import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Heart, Check } from 'lucide-react';

const moods = [
  { score: 1, label: 'Very low', color: 'bg-red-400', ring: 'ring-red-400' },
  { score: 2, label: 'Low', color: 'bg-orange-400', ring: 'ring-orange-400' },
  { score: 3, label: 'Neutral', color: 'bg-amber-300', ring: 'ring-amber-300' },
  { score: 4, label: 'Good', color: 'bg-lime-400', ring: 'ring-lime-400' },
  { score: 5, label: 'Very good', color: 'bg-emerald-400', ring: 'ring-emerald-400' },
];

export default function PortalMood() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedToday, setSavedToday] = useState(false);

  const fetchData = async () => {
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = (response.data?.moodEntries || []).find(m => m.entry_date === today);
      if (todayEntry) {
        setSelectedMood(todayEntry.mood_score);
        setNote(todayEntry.note || '');
        setSavedToday(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveMood = async () => {
    if (!selectedMood) return;
    setSaving(true);
    try {
      await base44.functions.invoke('clientSaveMood', {
        mood_score: selectedMood,
        mood_label: moods[selectedMood - 1]?.label.toLowerCase().replace(/\s+/g, '_') || '',
        note: note,
        entry_date: new Date().toISOString().split('T')[0]
      });
      setSavedToday(true);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const entries = (data?.moodEntries || []).sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  const recent = entries.slice(0, 14).reverse();

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Mood Journal</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">How are you feeling today?</p>
      </div>

      {/* Mood selector */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        {savedToday && (
          <div className="mb-4 inline-flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Check className="w-3 h-3" /> Already logged today
          </div>
        )}
        <div className="flex justify-between gap-2 mb-4">
          {moods.map(m => (
            <button
              key={m.score}
              onClick={() => setSelectedMood(m.score)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                selectedMood === m.score ? `ring-2 ${m.ring} bg-neutral-50` : 'hover:bg-neutral-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${m.color} ${selectedMood === m.score ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 text-center">{m.label}</span>
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          placeholder="Optional note..."
          className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-300 mb-3"
        />
        <button
          onClick={saveMood}
          disabled={!selectedMood || saving}
          className="w-full py-3 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest disabled:opacity-30 transition-colors"
        >
          {saving ? 'Saving...' : 'Save mood'}
        </button>
      </div>

      {/* Chart */}
      {recent.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-display text-lg text-neutral-800 mb-4">Recent mood</h2>
          <div className="flex items-end justify-between gap-1 h-32">
            {recent.map((m, i) => {
              const mood = moods[m.mood_score - 1];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t ${mood?.color || 'bg-neutral-300'}`} style={{ height: `${m.mood_score * 18}%` }} />
                  <span className="text-[8px] text-neutral-400">{new Date(m.entry_date).getDate()}/{new Date(m.entry_date).getMonth() + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {entries.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-display text-lg text-neutral-800 mb-4">History</h2>
          <div className="space-y-2">
            {entries.map((m, i) => {
              const mood = moods[m.mood_score - 1];
              return (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className={`w-3 h-3 rounded-full ${mood?.color || 'bg-neutral-300'} flex-shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">{mood?.label || 'Unknown'}</p>
                      <p className="text-xs text-neutral-400">{new Date(m.entry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                    </div>
                    {m.note && <p className="text-xs text-neutral-600 font-light mt-1">{m.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {entries.length === 0 && !savedToday && (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-neutral-400 font-light">No mood entries yet.</p>
        </div>
      )}
    </div>
  );
}