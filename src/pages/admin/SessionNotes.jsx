import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminSessionNotes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('adminGetContent', {});
        setData(response.data);
      } catch (err) {
        console.error(err);
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

  const notes = data?.sessionNotes || [];

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Session Notes</h1>
        <p className="text-xs text-red-600/70 uppercase tracking-widest mt-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Private — not visible to clients</p>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400 font-light">No session notes yet.</p>
          <p className="text-xs text-neutral-400 mt-2">Open a client to add a note.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(n => (
            <Link key={n.id} to={`/admin/clienten/${n.client_id}`} className="bg-white rounded-lg border border-neutral-200 p-5 block hover:border-neutral-300 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-800 font-medium">{n.client_display_name}</p>
                <span className="text-xs text-neutral-400">{new Date(n.session_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {n.summary && <p className="text-sm text-neutral-600 font-light line-clamp-2">{n.summary}</p>}
              {n.risk_assessment && <p className="text-xs text-red-600 mt-2 line-clamp-1">⚠ {n.risk_assessment}</p>}
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-red-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}