import React from 'react';

export default function UnreadInbox({ messages = [] }) {
  if (!messages.length) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">
        No unread messages — inbox clear.
      </p>
    );
  }

  return (
    <ul>
      {messages.slice(0, 6).map((m) => (
        <li
          key={m.id}
          className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0"
        >
          <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-800">{m.client_name || 'Client'}</p>
            <p className="text-xs text-neutral-500 font-light truncate mt-0.5">{m.content}</p>
          </div>
          <span className="font-mono text-[10px] text-neutral-400 flex-shrink-0">
            {m.created_date
              ? new Date(m.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}