import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function AssessmentStats() {
  const [completions, setCompletions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([
          base44.entities.AssessmentCompletion.list('-completed_date', 500),
          base44.entities.AssessmentProfile.list('priority', 50)
        ]);
        setCompletions(c);
        setProfiles(p);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading)
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-neutral-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>;

  const counts = {};
  completions.forEach(c => { counts[c.profile_key] = (counts[c.profile_key] || 0) + 1; });
  const maxCount = Math.max(...Object.values(counts), 1);
  const total = completions.length;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">Total completions</p>
        <p className="font-display text-4xl text-neutral-800">{total}</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-4">Per profile</p>
        <div className="space-y-3">
          {profiles.map(p => {
            const count = counts[p.profile_key] || 0;
            const pct = (count / maxCount) * 100;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-600 truncate flex-1">{p.title}</span>
                  <span className="text-xs text-neutral-400 ml-3">{count}</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600/60 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}