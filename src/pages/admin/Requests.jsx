import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Inbox, Mail } from 'lucide-react';
import { ErrorState } from '@/components/ListStates';

const statusConfig = {
  new: { label: 'New', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  waiting: { label: 'In progress', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  responded: { label: 'Answered', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

const struggleLabels = {
  stress: 'Stress & Overwhelm',
  burnout: 'Burnout',
  caregiving: 'Caregiving',
  grief: 'Grief & Loss',
  transitions: 'Life Transitions',
  exhaustion: 'Emotional Exhaustion',
  other: 'Something else',
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await base44.entities.ContactRequest.list('-created_date', 100);
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const selected = requests.find(r => r.id === selectedId);

  const counts = {
    new: requests.filter(r => r.status === 'new').length,
    waiting: requests.filter(r => r.status === 'waiting').length,
    responded: requests.filter(r => r.status === 'responded').length,
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const updateStatus = async (newStatus) => {
    if (!selectedId) return;
    setUpdating(true);
    try {
      await base44.entities.ContactRequest.update(selectedId, { status: newStatus });
      setRequests(prev => prev.map(r => r.id === selectedId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Requests</h1>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setFilter(filter === 'new' ? 'all' : 'new')} className={`p-4 rounded-xl border transition-colors text-left ${filter === 'new' ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">New</span>
          </div>
          <p className="text-2xl font-display text-neutral-800">{counts.new}</p>
        </button>
        <button onClick={() => setFilter(filter === 'waiting' ? 'all' : 'waiting')} className={`p-4 rounded-xl border transition-colors text-left ${filter === 'waiting' ? 'border-amber-300 bg-amber-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">In progress</span>
          </div>
          <p className="text-2xl font-display text-neutral-800">{counts.waiting}</p>
        </button>
        <button onClick={() => setFilter(filter === 'responded' ? 'all' : 'responded')} className={`p-4 rounded-xl border transition-colors text-left ${filter === 'responded' ? 'border-green-300 bg-green-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">Answered</span>
          </div>
          <p className="text-2xl font-display text-neutral-800">{counts.responded}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Request list */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">Requests ({filtered.length})</p>
            {filter !== 'all' && <button onClick={() => setFilter('all')} className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Show all</button>}
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {filtered.length === 0 ? (
              <p className="text-sm text-neutral-400 font-light p-6 text-center">No requests yet.</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filtered.map(r => {
                  const cfg = statusConfig[r.status] || statusConfig.new;
                  return (
                    <button key={r.id} onClick={() => setSelectedId(r.id)} className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${selectedId === r.id ? 'bg-red-50/50' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-neutral-800 font-medium truncate">{r.first_name} {r.last_name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{r.email}</p>
                      {r.struggle && <p className="text-[10px] text-neutral-400 mt-1">{struggleLabels[r.struggle] || r.struggle}</p>}
                      <p className="text-[9px] text-neutral-300 mt-1">{new Date(r.created_date).toLocaleDateString('en-US')}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail view */}
        <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200">
          {!selected ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Inbox className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm text-neutral-400 font-light">Select a request</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl text-neutral-800">{selected.first_name} {selected.last_name}</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    <a href={`mailto:${selected.email}`} className="hover:text-red-600 transition-colors">{selected.email}</a>
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border ${statusConfig[selected.status]?.color || statusConfig.new.color}`}>
                  {statusConfig[selected.status]?.label || 'New'}
                </span>
              </div>

              {selected.struggle && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Concern</p>
                  <p className="text-sm text-neutral-700">{struggleLabels[selected.struggle] || selected.struggle}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Message</p>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 font-light leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Received on</p>
                <p className="text-sm text-neutral-500">{new Date(selected.created_date).toLocaleString('en-US')}</p>
              </div>

              {/* Status controls */}
              <div className="border-t border-neutral-100 pt-4">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Change status</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateStatus('new')} disabled={updating || selected.status === 'new'} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${selected.status === 'new' ? 'border-red-300 bg-red-50 text-red-700' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> New
                    </button>
                    <button onClick={() => updateStatus('waiting')} disabled={updating || selected.status === 'waiting'} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${selected.status === 'waiting' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> In progress
                    </button>
                    <button onClick={() => updateStatus('responded')} disabled={updating || selected.status === 'responded'} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${selected.status === 'responded' ? 'border-green-300 bg-green-50 text-green-700' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Answered
                    </button>
                </div>
              </div>

              {/* Quick reply */}
              <div className="border-t border-neutral-100 pt-4 mt-4">
                <a href={`mailto:${selected.email}?subject=Re: Your request to studioHuman`} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-700 hover:text-red-600 transition-colors border-b border-neutral-300 hover:border-red-600 py-2">
                  <Mail className="w-4 h-4" /> Reply by email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}