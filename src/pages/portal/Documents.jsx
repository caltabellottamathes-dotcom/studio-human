import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Download, Search } from 'lucide-react';

const categoryLabels = { intake: 'Intake', report: 'Report', exercise: 'Exercise', invoice: 'Invoice', other: 'Document' };

export default function PortalDocuments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('getClientPortalData', {});
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

  const allDocs = data?.documents || [];
  const categories = ['all', ...new Set(allDocs.map(d => d.category))];
  const docs = allDocs.filter(d => {
    if (filter !== 'all' && d.category !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Documents</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">Securely view your shared documents.</p>
      </div>

      {allDocs.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-neutral-400 font-light">No documents have been shared with you yet.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-colors ${filter === cat ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500'}`}>
                  {cat === 'all' ? 'All' : categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {docs.map(doc => (
              <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center gap-4 hover:border-neutral-300 transition-colors group">
                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-800 font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{categoryLabels[doc.category] || doc.category}</p>
                  {doc.description && <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{doc.description}</p>}
                </div>
                <Download className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}