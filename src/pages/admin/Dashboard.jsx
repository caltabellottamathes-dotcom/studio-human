import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Users, Calendar, MessageSquare, Clock, ArrowRight, Activity } from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent || 'bg-red-50 text-red-600'}`}>
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-3xl font-display text-neutral-800">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">{label}</p>
    </div>
  );
}

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
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const upcoming = data?.upcomingAppointments || [];
  const clients = data?.clients || [];
  const activity = data?.recentActivity || [];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Admin Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">An overview of your practice.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        <StatCard icon={Users} label="Active clients" value={stats.activeClients || 0} />
        <StatCard icon={Calendar} label="Scheduled appointments" value={stats.upcomingAppointments || 0} accent="bg-amber-50 text-amber-600" />
        <StatCard icon={MessageSquare} label="Unread messages" value={stats.unreadMessages || 0} accent="bg-blue-50 text-blue-600" />
        <StatCard icon={Activity} label="Total clients" value={stats.totalClients || 0} accent="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Upcoming appointments</h2>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">No appointments scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map(apt => (
                <div key={apt.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] uppercase text-red-600 leading-none">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-display text-red-700 leading-none mt-0.5">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 font-medium">{apt.client_name}</p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {apt.start_time} · {apt.duration_minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent clients */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-neutral-800">Clients</h2>
            <Link to="/admin/clienten" className="text-[10px] uppercase tracking-widest text-red-600 hover:underline flex items-center gap-1">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {clients.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">No clients yet.</p>
          ) : (
            <div className="space-y-2">
              {clients.slice(0, 5).map(c => (
                <div key={c.user_id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="text-sm text-neutral-800 font-medium">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-neutral-400">{c.email}</p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    c.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                    c.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-neutral-100 text-neutral-400'
                  }`}>{c.status === 'active' ? 'Active' : c.status === 'pending' ? 'Pending' : 'Archived'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 md:col-span-2">
          <h2 className="font-display text-lg text-neutral-800 mb-4">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-4">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 8).map(log => (
                <div key={log.id} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700">{log.details || log.action}</p>
                    <p className="text-[10px] text-neutral-400">{log.actor_name} · {new Date(log.created_date).toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}