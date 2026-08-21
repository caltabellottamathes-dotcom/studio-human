import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
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

export default function ScheduleLoadChart({ upcomingAppointments = [] }) {
  const data = useMemo(() => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
    upcomingAppointments.forEach((a) => {
      const d = new Date(a.date);
      if (!isNaN(d)) counts[d.getDay()] = (counts[d.getDay()] || 0) + 1;
    });
    return order.map((n, i) => ({ day: names[i], count: counts[n] }));
  }, [upcomingAppointments]);

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e6e6e0" strokeDasharray="2 4" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Lekton, monospace', fill: '#8E9192' }}
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip cursor={{ fill: '#f2f1e6' }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" name="Appointments" radius={[6, 6, 0, 0]} maxBarSize={42}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.count === max && d.count > 0 ? '#88822a' : '#a9a135'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}