import React from 'react';

export default function AdminStatLedger({ stats = {} }) {
  const {
    activeClients = 0,
    upcomingAppointments = 0,
    unreadMessages = 0,
    totalClients = 0,
  } = stats;

  const others = Math.max(0, totalClients - activeClients);

  const items = [
    { label: 'Active clients', value: activeClients, sub: `of ${totalClients} total` },
    { label: 'Scheduled', value: upcomingAppointments, sub: 'appointments ahead' },
    { label: 'Unread messages', value: unreadMessages, sub: 'awaiting reply' },
    { label: 'Total clients', value: totalClients, sub: `${activeClients} active · ${others} others` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border-y border-neutral-200 rounded-[1.5rem] overflow-hidden">
      {items.map((it) => (
        <div key={it.label} className="bg-neutral-50 px-6 py-8 md:px-8 md:py-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-600/70 block mb-3">
            {it.label}
          </span>
          <p className="font-display text-5xl md:text-6xl text-neutral-800 leading-none tabular-nums">
            {it.value}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-3">
            {it.sub}
          </p>
        </div>
      ))}
    </div>
  );
}