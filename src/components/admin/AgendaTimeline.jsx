import React from 'react';

const TYPE_LABELS = {
  intake: 'Intake',
  session: 'Session',
  online: 'Online',
  physical: 'In person',
  phone: 'Phone',
};

export default function AgendaTimeline({ appointments = [] }) {
  if (!appointments.length) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">
        No appointments scheduled.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[3.4rem] top-3 bottom-3 w-px bg-neutral-200 hidden sm:block" aria-hidden />
      <ul>
        {appointments.map((a) => {
          const d = new Date(a.date);
          const month = isNaN(d) ? '—' : d.toLocaleDateString('en-US', { month: 'short' });
          const day = isNaN(d) ? '—' : d.getDate();
          return (
            <li
              key={a.id}
              className="relative flex items-center gap-4 sm:gap-6 py-4 border-b border-neutral-100 last:border-0"
            >
              <div className="w-12 sm:w-14 flex-shrink-0 text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-600/70 block">
                  {month}
                </span>
                <span className="font-display text-2xl text-neutral-800 leading-none tabular-nums">{day}</span>
              </div>
              <span className="absolute left-[3.4rem] top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 ring-4 ring-neutral-50 hidden sm:block" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-neutral-800 truncate">{a.client_name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                  {a.start_time} · {a.duration_minutes} min · {TYPE_LABELS[a.type] || 'Session'}
                </p>
              </div>
              {a.location && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 hidden md:block">
                  {a.location}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}