import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Calendar, FileText, ClipboardList, MessageSquare, Heart, Clock, ArrowRight } from 'lucide-react';

const moodLabels = {
  very_low: 'Zeer laag', low: 'Laag', neutral: 'Neutraal', good: 'Goed', very_good: 'Zeer goed'
};

function SummaryCard({ icon: Icon, label, count, to, accent }) {
  return (
    <Link to={to} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent || 'bg-red-50 text-red-600'}`}>
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-2xl font-display text-neutral-800">{count}</p>
      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">{label}</p>
    </Link>
  );
}

export default function PortalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('getClientPortalData', {});
        setData(response.data);
      } catch (err) {
        console.error('Failed to load portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const upcoming = (data?.appointments || [])
    .filter(a => a.status === 'scheduled' && a.date >= today)
    .sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const pendingAssignments = (data?.assignments || []).filter(a => a.status === 'assigned' || a.status === 'in_progress');
  const unreadMessages = (data?.messages || []).filter(m => m.sender === 'admin' && !m.read);
  const recentDocuments = (data?.documents || []).slice(-4).reverse();
  const recentMood = (data?.moodEntries || []).slice(0, 7).reverse();
  const firstName = data?.profile?.first_name || data?.user?.full_name?.split(' ')[0] || '';

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Welkom terug</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">
          Hallo, {firstName}
        </h1>
        <p className="text-neutral-500 text-sm font-light mt-2">Hier is een overzicht van je traject.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        <SummaryCard icon={Calendar} label="Komende afspraken" count={upcoming.length} to="/portal/afspraken" />
        <SummaryCard icon={ClipboardList} label="Open opdrachten" count={pendingAssignments.length} to="/portal/opdrachten" accent="bg-amber-50 text-amber-600" />
        <SummaryCard icon={MessageSquare} label="Nieuwe berichten" count={unreadMessages.length} to="/portal/berichten" accent="bg-blue-50 text-blue-600" />
        <SummaryCard icon={Heart} label="Stemmingen" count={recentMood.length} to="/portal/stemming" accent="bg-rose-50 text-rose-600" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Komende afspraken</h2>
            <Link to="/portal/afspraken" className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Alle</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">Geen afspraken gepland.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map(apt => (
                <div key={apt.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] uppercase text-red-600 leading-none">{new Date(apt.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
                    <span className="text-sm font-display text-red-700 leading-none mt-0.5">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 font-medium capitalize">{apt.type === 'online' ? 'Online sessie' : apt.type === 'physical' ? 'Fysieke sessie' : apt.type === 'intake' ? 'Intakegesprek' : 'Sessie'}</p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {apt.start_time} · {apt.duration_minutes} min
                    </p>
                    {apt.location && <p className="text-xs text-neutral-400 mt-0.5">{apt.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Berichten</h2>
            <Link to="/portal/berichten" className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Alle</Link>
          </div>
          {(data?.messages || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">Nog geen berichten.</p>
          ) : (
            <div className="space-y-3">
              {(data?.messages || []).slice(-3).reverse().map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-red-50/50' : 'bg-neutral-50'}`}>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{msg.sender === 'admin' ? 'Debora' : 'Jij'}</p>
                  <p className="text-sm text-neutral-700 font-light line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending assignments */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Open opdrachten</h2>
            <Link to="/portal/opdrachten" className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Alle</Link>
          </div>
          {pendingAssignments.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">Geen openstaande opdrachten.</p>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map(a => (
                <div key={a.id} className="py-2 border-b border-neutral-100 last:border-0">
                  <p className="text-sm text-neutral-800 font-medium">{a.title}</p>
                  {a.due_date && <p className="text-xs text-neutral-400 mt-0.5">Uiterlijk: {new Date(a.due_date).toLocaleDateString('nl-NL')}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mood tracking */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Stemming</h2>
            <Link to="/portal/stemming" className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Details</Link>
          </div>
          {recentMood.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">Nog geen stemmingen geregistreerd.</p>
          ) : (
            <div className="flex items-end justify-between gap-1 h-20">
              {recentMood.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-red-200" style={{ height: `${m.mood_score * 16}%` }} />
                  <span className="text-[9px] text-neutral-400">{new Date(m.entry_date).getDate()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}