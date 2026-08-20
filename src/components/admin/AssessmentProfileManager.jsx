import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AssessmentProfileEditor from './AssessmentProfileEditor';

export default function AssessmentProfileManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const fetchData = async () => {
    try {
      setProfiles(await base44.entities.AssessmentProfile.list('priority', 50));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile? Existing results may be affected.')) return;
    await base44.entities.AssessmentProfile.delete(id);
    fetchData();
  };

  if (loading)
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-neutral-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setEditing(null); setEditorOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-body transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New profile
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {profiles.length === 0 ? (
          <div className="p-12 text-center"><p className="text-sm text-neutral-400">No profiles yet.</p></div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {profiles.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-800 truncate">{p.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5 font-mono">{p.profile_key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(p); setEditorOpen(true); }} className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <AssessmentProfileEditor
          open={editorOpen}
          profile={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}