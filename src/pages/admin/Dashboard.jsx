import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import FadeSection from '@/components/FadeSection';
import AdminStatLedger from '@/components/admin/AdminStatLedger';
import SectionShell from '@/components/admin/SectionShell';
import PracticePulseChart from '@/components/admin/PracticePulseChart';
import ScheduleLoadChart from '@/components/admin/ScheduleLoadChart';
import ClientCompositionChart from '@/components/admin/ClientCompositionChart';
import AgendaTimeline from '@/components/admin/AgendaTimeline';
import ActivityFeed from '@/components/admin/ActivityFeed';
import UnreadInbox from '@/components/admin/UnreadInbox';
import LivePulse from '@/components/admin/LivePulse';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('getAdminOverview', {});
        setData(response.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const upcoming = data?.upcomingAppointments || [];
  const clients = data?.clients || [];
  const activity = data?.recentActivity || [];
  const unread = data?.unreadMessages || [];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[112rem]">
      {/* Header */}
      <FadeSection className="mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-3">
              Admin Portal
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-neutral-800 tracking-tight leading-none">
              Dashboard
            </h1>
            <p className="text-neutral-500 font-light mt-3">An overview of your practice.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <LivePulse />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Live</span>
            <span className="font-mono text-[10px] text-neutral-300">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{today}</span>
          </div>
        </div>
      </FadeSection>

      {/* Stat ledger */}
      <FadeSection className="mb-10 md:mb-12">
        <AdminStatLedger stats={stats} />
      </FadeSection>

      {/* Practice pulse */}
      <FadeSection className="mb-6 md:mb-8">
        <SectionShell
          title="Practice pulse"
          label="Activity"
          sub="Logged actions across the last two weeks"
        >
          <PracticePulseChart recentActivity={activity} />
        </SectionShell>
      </FadeSection>

      {/* Schedule load + Client composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        <FadeSection>
          <SectionShell title="Schedule load" label="Agenda" sub="Upcoming appointments by weekday">
            <ScheduleLoadChart upcomingAppointments={upcoming} />
          </SectionShell>
        </FadeSection>
        <FadeSection delay={0.05}>
          <SectionShell title="Client composition" label="People" sub="Active, pending and archived">
            <ClientCompositionChart clients={clients} />
          </SectionShell>
        </FadeSection>
      </div>

      {/* Agenda timeline */}
      <FadeSection className="mb-6 md:mb-8">
        <SectionShell title="Upcoming agenda" label="Schedule" sub="The next appointments in view">
          <AgendaTimeline appointments={upcoming} />
        </SectionShell>
      </FadeSection>

      {/* Activity + Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeSection>
          <SectionShell title="Recent activity" label="Log" sub="">
            <ActivityFeed activity={activity} />
          </SectionShell>
        </FadeSection>
        <FadeSection delay={0.05}>
          <SectionShell title="Inbox" label="Messages" sub="Unread, awaiting reply">
            <UnreadInbox messages={unread} />
          </SectionShell>
        </FadeSection>
      </div>
    </div>
  );
}