import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ClientCompositionChart({ clients = [] }) {
  const active = clients.filter((c) => c.status === 'active').length;
  const pending = clients.filter((c) => c.status === 'pending').length;
  const archived = clients.filter((c) => c.status === 'archived').length;
  const total = active + pending + archived;

  const segments = [
    { name: 'Active', value: active, fill: '#a9a135' },
    { name: 'Pending', value: pending, fill: '#94a9cb' },
    { name: 'Archived', value: archived, fill: '#c6c08e' },
  ];

  const data = total ? segments : [{ name: 'None', value: 1, fill: '#e6e6e0' }];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-44 h-44 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={total ? 2 : 0}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-3xl text-neutral-800 leading-none tabular-nums">{total}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-1">clients</span>
        </div>
      </div>

      <ul className="flex-1 w-full">
        {segments.map((s) => (
          <li
            key={s.name}
            className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 last:border-0"
          >
            <span className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-600">{s.name}</span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-xl text-neutral-800 tabular-nums">{s.value}</span>
              <span className="font-mono text-[10px] text-neutral-400">
                {total ? Math.round((s.value / total) * 100) : 0}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}