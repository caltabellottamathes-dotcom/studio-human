import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import SectionShell from '@/components/admin/SectionShell';

const TYPE_LABELS = {
  intake: 'Intake session',
  session: 'Session',
  online: 'Online session',
  physical: 'In-person session',
  phone: 'Phone session',
};

export default function NextSessionCard({ upcoming = [] }) {
  const next = upcoming[0];

  return (
    <SectionShell title="Your next session" label="Schedule" sub={next ? 'Coming up soon' : 'Nothing booked yet'}>
      {next ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[1rem] bg-red-50 border border-red-100 flex flex-col items-center justify-center flex-shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-red-600/80">
                {new Date(next.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="font-display text-3xl text-neutral-800 leading-none mt-1 tabular-nums">
                {new Date(next.date).getDate()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl text-neutral-800">{TYPE_LABELS[next.type] || 'Session'}</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 mt-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> {next.start_time} · {next.duration_minutes} min
              </p>
              {next.location && (
                <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {next.location}
                </p>
              )}
            </div>
          </div>
          <Link
            to="/portal/appointments"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-red-600 hover:gap-3 transition-all w-fit"
          >
            View bookings <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-4">
          <p className="font-display text-xl text-neutral-700">No session scheduled yet.</p>
          <p className="text-sm text-neutral-400 font-light max-w-[30ch]">
            We'll be in touch to arrange your next appointment — reach out anytime.
          </p>
          <Link
            to="/portal/messages"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-red-600 hover:gap-3 transition-all mt-1"
          >
            Message Maya <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      )}
    </SectionShell>
  );
}