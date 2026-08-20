import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, UserPlus, Mail, Phone, ArrowRight } from 'lucide-react';
import CreateClientDialog from '@/components/admin/CreateClientDialog';
import { ErrorState } from '@/components/ListStates';

export default function AdminClients() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('getAdminOverview', {});
      setData(response.data);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Clients</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const clients = (data?.clients || []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Clients</h1>
        </div>
        <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-body transition-colors">
          <UserPlus className="w-4 h-4" strokeWidth={1.5} />
          New client
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-neutral-200 rounded-xl pl-12 pr-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-neutral-400 font-light">No clients found.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {clients.map(c => (
              <Link key={c.user_id} to={`/admin/clients/${c.user_id}`} className="flex items-center justify-between p-4 md:p-5 hover:bg-neutral-50 transition-colors group">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-display text-red-700">
                      {(c.first_name?.[0] || '?').toUpperCase()}{(c.last_name?.[0] || '').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-800 font-medium truncate">
                      {c.first_name} {c.last_name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.email && (
                        <span className="text-xs text-neutral-400 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" /> {c.email}
                        </span>
                      )}
                      {c.phone && (
                        <span className="text-xs text-neutral-400 flex items-center gap-1 hidden md:flex">
                          <Phone className="w-3 h-3" /> {c.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    c.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                    c.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-neutral-100 text-neutral-400'
                  }`}>
                    {c.status === 'active' ? 'Active' : c.status === 'pending' ? 'Pending' : 'Archived'}
                    </span>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400 font-light mt-4">
        {clients.length} {clients.length !== 1 ? 'clients' : 'client'} {search ? 'found' : 'total'}
      </p>

      <CreateClientDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={fetchData} />
    </div>
  );
}