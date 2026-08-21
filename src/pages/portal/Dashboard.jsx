import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FadeSection from '@/components/FadeSection';
import SectionShell from '@/components/admin/SectionShell';
import LivePulse from '@/components/admin/LivePulse';
import PortalStatLedger from '@/components/portal/PortalStatLedger';
import NextSessionCard from '@/components/portal/NextSessionCard';
import MoodTrendChart from '@/components/portal/MoodTrendChart';
import QuickActions from '@/components/portal/QuickActions';
import { ErrorState } from '@/components/ListStates';

export default function PortalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
    } catch (err) {
      console.error('Failed to load portal data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[112rem]">
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-3">Welcome back</span>
          <h1 className="font-display text-4xl md:text-6xl text-neutral-800 tracking-tight leading-none">Dashboard</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const upcoming = (data?.appointments || [])
    .filter((a) => a.status === 'scheduled' && a.date >= today)
    .sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const pendingAssignments = (data?.assignments || []).filter((a) => a.status === 'assigned' || a.status === 'in_progress');
  const unreadMessages = (data?.messages || []).filter((m) => m.sender === 'admin' && !m.read);
  const moodEntries = data?.moodEntries || [];
  const firstName = data?.profile?.first_name || data?.user?.full_name?.split(' ')[0] || '';
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[112rem]">
      {/* Header */}
      <FadeSection className="mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-3">Welcome back</span>
            <h1 className="font-display text-4xl md:text-6xl text-neutral-800 tracking-tight leading-none">
              Hello, {firstName}
            </h1>
            <p className="text-neutral-500 font-light mt-3">Here's an overview of your journey.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <LivePulse />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Live</span>
            <span className="font-mono text-[10px] text-neutral-300">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{todayLabel}</span>
          </div>
        </div>
      </FadeSection>

      {/* Stat ledger */}
      <FadeSection className="mb-10 md:mb-12">
        <PortalStatLedger
          upcoming={upcoming.length}
          openAssignments={pendingAssignments.length}
          unread={unreadMessages.length}
          moodCount={moodEntries.length}
        />
      </FadeSection>

      {/* Next session + mood trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        <FadeSection>
          <NextSessionCard upcoming={upcoming} />
        </FadeSection>
        <FadeSection delay={0.05}>
          <MoodTrendChart moodEntries={moodEntries} />
        </FadeSection>
      </div>

      {/* Quick actions */}
      <FadeSection className="mb-6 md:mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-600/70 block mb-4">Quick actions</span>
        <QuickActions />
      </FadeSection>

      {/* Open assignments + messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeSection>
          <SectionShell title="Open assignments" label="Tasks" sub="">
            {pendingAssignments.length === 0 ? (
              <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">
                No open assignments right now.
              </p>
            ) : (
              <ul>
                {pendingAssignments.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 last:border-0">
                    <div className="min-w-0">
                      <p className="font-display text-base text-neutral-800 truncate">{a.title}</p>
                      {a.due_date && (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                          Due {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <Link
                      to="/portal/assignments"
                      className="font-mono text-[10px] uppercase tracking-widest text-red-600 flex items-center gap-1.5 hover:gap-2 transition-all flex-shrink-0"
                    >
                      Open <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </SectionShell>
        </FadeSection>
        <FadeSection delay={0.05}>
          <SectionShell title="Messages" label="Inbox" sub="">
            {(data?.messages || []).length === 0 ? (
              <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6">No messages yet.</p>
            ) : (
              <ul>
                {(data?.messages || []).slice(-5).reverse().map((msg) => (
                  <li key={msg.id} className="py-3 border-b border-neutral-100 last:border-0">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                      {msg.sender === 'admin' ? 'Maya' : 'You'}
                    </p>
                    <p className="text-sm text-neutral-700 font-light line-clamp-2">{msg.content}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/portal/messages"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-red-600 hover:gap-3 transition-all mt-4"
            >
              All messages <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </SectionShell>
        </FadeSection>
      </div>
    </div>
  );
}