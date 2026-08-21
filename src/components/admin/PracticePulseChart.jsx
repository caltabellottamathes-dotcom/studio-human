import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const tooltipStyle = {
  background: '#F7F7F5',
  border: '1px solid #d7d6b9',
  borderRadius: '0.75rem',
  fontFamily: 'Lekton, monospace',
  fontSize: 11,
  color: '#444305',
  boxShadow: 'none',
};

export default function PracticePulseChart({ recentActivity = [] }) {
  const data = useMemo(() => {
    const map = {};
    recentActivity.forEach((log) => {
      const d = log?.created_date?.slice(0, 10);
      if (d) map[d] = (map[d] || 0) + 1;
    });
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: map[key] || 0,
      });
    }
    return days;
  }, [recentActivity]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9a135" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#a9a135" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e6e6e0" strokeDasharray="2 4" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#8E9192' }} />
        <Area
          type="monotone"
          dataKey="count"
          name="Activity"
          stroke="#a9a135"
          strokeWidth={2}
          fill="url(#pulseFill)"
          dot={false}
          activeDot={{ r: 4, fill: '#88822a', stroke: '#F7F7F5', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}