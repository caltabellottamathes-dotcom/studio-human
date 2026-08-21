import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, FileText, Calendar, ArrowRight } from 'lucide-react';
import { useBrand } from '@/hooks/useBrand';

export default function QuickActions() {
  const { practitionerName } = useBrand();
  const actions = [
    { label: `Message ${practitionerName}`, to: '/portal/messages', icon: MessageSquare },
    { label: 'Log your mood', to: '/portal/mood', icon: Heart },
    { label: 'Your documents', to: '/portal/documents', icon: FileText },
    { label: 'View bookings', to: '/portal/appointments', icon: Calendar },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((a) => (
        <Link
          key={a.label}
          to={a.to}
          className="group bg-white/60 border border-neutral-200/70 rounded-[1.25rem] p-5 hover:bg-white transition-colors flex flex-col justify-between min-h-[7.5rem]"
        >
          <a.icon className="w-5 h-5 text-red-600/70 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-600 group-hover:text-neutral-800 transition-colors">
              {a.label}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
          </div>
        </Link>
      ))}
    </div>
  );
}