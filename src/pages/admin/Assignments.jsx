import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight } from 'lucide-react';

const typeLabel = { homework: 'Huiswerk', reflection: 'Reflectie', exercise: 'Oefening', reading: 'Leesopdracht' };
const statusLabel = { assigned: 'Toegewezen', in_progress: 'Bezig', submitted: 'Ingediend', reviewed: 'Beoordeeld' };

export default function AdminAssignments() {
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

  const assignments = data?.assignments || [];

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Beheer</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Opdrachten</h1>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400 font-light">Nog geen opdrachten.</p>
          <p className="text-xs text-neutral-400 mt-2">Open een cliënt om een opdracht toe te wijzen.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {assignments.map(a => (
            <Link key={a.id} to={`/admin/clienten/${a.client_id}`} className="bg-white rounded-lg border border-neutral-200 p-4 block hover:border-neutral-300 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-neutral-800 font-medium">{a.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{a.client_display_name} · {typeLabel[a.type] || a.type}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    a.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                    a.status === 'submitted' ? 'bg-amber-50 text-amber-600' :
                    a.status === 'reviewed' ? 'bg-emerald-50 text-emerald-600' : ''
                  }`}>{statusLabel[a.status] || a.status}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              {a.due_date && <p className="text-xs text-neutral-400 mt-1">Uiterlijk: {new Date(a.due_date).toLocaleDateString('nl-NL')}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}