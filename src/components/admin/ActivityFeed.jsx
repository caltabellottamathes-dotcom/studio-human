import React from 'react';

export default function ActivityFeed({ activity = [] }) {
  if (!activity.length) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1 top-2 bottom-2 w-px bg-neutral-200" aria-hidden />
      <ul className="space-y-5">
        {activity.slice(0, 8).map((log) => (
          <li key={log.id} className="relative pl-8">
            <span className="absolute left-1 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400" />
            <p className="text-sm text-neutral-700 leading-snug">{log.details || log.action}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              {log.actor_name} ·{' '}
              {log.created_date
                ? new Date(log.created_date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}