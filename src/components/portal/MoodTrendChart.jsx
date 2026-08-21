import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowRight } from 'lucide-react';
import SectionShell from '@/components/admin/SectionShell';

const tooltipStyle = {
  background: '#F7F7F5',
  border: '1px solid #c4cee3',
  borderRadius: '0.75rem',
  fontFamily: 'Lekton, monospace',
  fontSize: 11,
  color: '#2b3850',
  boxShadow: 'none',
};

const moodWords = { 1: 'Very low', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Very good' };

export default function MoodTrendChart({ moodEntries = [] }) {
  const data = useMemo(() => {
    return [...moodEntries]
      .sort((a, b) => (a.entry_date || '').localeCompare(b.entry_date || ''))
      .slice(-14)
      .map((e) => ({
        label: new Date(e.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: e.mood_score,
      }));
  }, [moodEntries]);

  const latest = data.length ? data[data.length - 1].mood : null;

  return (
    <SectionShell title="Your mood" label="Wellbeing" sub={latest ? `Latest: ${moodWords[latest]}` : 'No entries yet'}>
      {data.length ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a9cb" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#94a9cb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e6e6e0" strokeDasharray="2 4" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="mood"
              name="Mood"
              stroke="#6f87b3"
              strokeWidth={2}
              fill="url(#moodFill)"
              dot={{ r: 3, fill: '#6f87b3' }}
              activeDot={{ r: 4, fill: '#566d94', stroke: '#F7F7F5', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-start gap-3 py-4">
          <p className="font-display text-xl text-neutral-700">Start tracking how you feel.</p>
          <p className="text-sm text-neutral-400 font-light max-w-[32ch]">
            A quick daily check-in helps you and Maya notice patterns over time.
          </p>
          <Link
            to="/portal/mood"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-red-600 hover:gap-3 transition-all mt-1"
          >
            Log your mood <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      )}
    </SectionShell>
  );
}