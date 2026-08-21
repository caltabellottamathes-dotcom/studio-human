import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import AnimatedCounter from '@/components/motion/AnimatedCounter';

export default function PortalStatLedger({ upcoming = 0, openAssignments = 0, unread = 0, moodCount = 0 }) {
  const items = [
    { label: 'Upcoming', value: upcoming, to: '/portal/appointments', icon: Calendar },
    { label: 'Open tasks', value: openAssignments, to: '/portal/assignments', icon: ClipboardList },
    { label: 'New messages', value: unread, to: '/portal/messages', icon: MessageSquare },
    { label: 'Mood entries', value: moodCount, to: '/portal/mood', icon: Heart },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border-y border-neutral-200 rounded-[1.5rem] overflow-hidden">
      {items.map((it) => (
        <Link
          key={it.label}
          to={it.to}
          className="bg-neutral-50 px-6 py-8 md:px-8 md:py-10 group hover:bg-white/70 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <it.icon className="w-4 h-4 text-red-600/70" strokeWidth={1.5} />
            <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
          </div>
          <p className="font-display text-5xl md:text-6xl text-neutral-800 leading-none tabular-nums">
            <AnimatedCounter to={it.value} duration={1.4} />
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-3">{it.label}</p>
        </Link>
      ))}
    </div>
  );
}