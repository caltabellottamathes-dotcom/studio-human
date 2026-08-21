import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeSection from '@/components/FadeSection';
import SectionShell from '@/components/admin/SectionShell';
import PortalPageHeader from '@/components/portal/PortalPageHeader';
import MoodChart from '@/components/portal/MoodChart';
import { ErrorState } from '@/components/ListStates';

const moods = [
  { score: 1, label: 'Very low', color: '#566d94' },
  { score: 2, label: 'Low', color: '#94a9cb' },
  { score: 3, label: 'Neutral', color: '#c6c08e' },
  { score: 4, label: 'Good', color: '#b8af55' },
  { score: 5, label: 'Very good', color: '#a9a135' },
];

export default function PortalMood() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedToday, setSavedToday] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = (response.data?.moodEntries || []).find((m) => m.entry_date === today);
      if (todayEntry) {
        setSelectedMood(todayEntry.mood_score);
        setNote(todayEntry.note || '');
        setSavedToday(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
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
        entry_date: new Date().toISOString().split('T')[0],
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
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[60rem]">
        <PortalPageHeader label="Client Portal" title="Mood Journal" />
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const entries = (data?.moodEntries || []).sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  const recent = entries.slice(0, 14).reverse();
  const chartData = recent.map((e) => ({
    label: new Date(e.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: e.mood_score,
  }));

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[60rem]">
      <PortalPageHeader label="Client Portal" title="Mood Journal" sub="How are you feeling today?" />

      {/* Daily check-in */}
      <FadeSection className="mb-6">
        <SectionShell title="Daily check-in" label="Wellbeing" sub={savedToday ? 'Logged today' : 'Tap a mood'}>
          <AnimatePresence>
            {savedToday && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full mb-5"
              >
                <Check className="w-3 h-3 text-red-600" /> Already logged today
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-2 mb-6">
            {moods.map((m) => (
              <button
                key={m.score}
                onClick={() => setSelectedMood(m.score)}
                className="flex-1 flex flex-col items-center gap-2.5 p-3 rounded-xl transition-colors group"
              >
                <motion.div
                  animate={{ scale: selectedMood === m.score ? 1.18 : 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="w-9 h-9 rounded-full"
                  style={{
                    background: m.color,
                    boxShadow:
                      selectedMood === m.score
                        ? `0 0 0 3px #F7F7F5, 0 0 0 5px ${m.color}66`
                        : 'none',
                  }}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest text-center transition-colors ${
                    selectedMood === m.score ? 'text-neutral-800' : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Optional note..."
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-400 mb-3 resize-none"
          />
          <button
            onClick={saveMood}
            disabled={!selectedMood || saving}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-red-50 rounded-full font-mono text-[11px] uppercase tracking-widest disabled:opacity-30 transition-colors"
          >
            {saving ? 'Saving…' : 'Save mood'}
          </button>
        </SectionShell>
      </FadeSection>

      {/* Trend chart */}
      {recent.length > 0 && (
        <FadeSection className="mb-6">
          <SectionShell title="Recent mood" label="Trend" sub="Last two weeks">
            <MoodChart data={chartData} />
          </SectionShell>
        </FadeSection>
      )}

      {/* History */}
      {entries.length > 0 ? (
        <FadeSection>
          <SectionShell title="History" label="Log" sub="">
            <ul>
              {entries.map((m, i) => {
                const mood = moods[m.mood_score - 1];
                return (
                  <li key={i} className="flex items-start gap-4 py-4 border-b border-neutral-100 last:border-0">
                    <span
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: mood?.color || '#c6c08e' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-600">{mood?.label || 'Unknown'}</p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                          {new Date(m.entry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      {m.note && <p className="text-sm text-neutral-600 font-light mt-1.5 leading-relaxed">{m.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionShell>
        </FadeSection>
      ) : (
        !savedToday && (
          <FadeSection>
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Heart className="w-8 h-8 text-neutral-300" strokeWidth={1} />
              <p className="text-sm text-neutral-400 font-light">No mood entries yet.</p>
            </div>
          </FadeSection>
        )
      )}
    </div>
  );
}