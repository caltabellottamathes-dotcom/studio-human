import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const tooltipStyle = {
  background: '#F7F7F5',
  border: '1px solid #c4cee3',
  borderRadius: '0.75rem',
  fontFamily: 'Lekton, monospace',
  fontSize: 11,
  color: '#2b3850',
  boxShadow: 'none',
};

export default function MoodChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="moodAreaFill" x1="0" y1="0" x2="0" y2="1">
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
          fill="url(#moodAreaFill)"
          dot={{ r: 3, fill: '#6f87b3' }}
          activeDot={{ r: 4, fill: '#566d94', stroke: '#F7F7F5', strokeWidth: 2 }}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}