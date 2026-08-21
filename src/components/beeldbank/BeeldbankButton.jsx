import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useBeeldbank } from '@/lib/beeldbankContext';
import { Images, Loader2 } from 'lucide-react';

export default function BeeldbankButton() {
  const { user } = useAuth();
  const { mode, toggleMode, saving, dirtyCount } = useBeeldbank();

  if (user?.role !== 'admin') return null;

  const on = mode;
  return (
    <button
      type="button"
      onClick={toggleMode}
      disabled={saving}
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
        on ? 'bg-neutral-900 text-neutral-50 hover:bg-black' : 'bg-neutral-50/90 text-neutral-800 backdrop-blur hover:bg-white border border-neutral-200'
      }`}
      aria-pressed={on}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4" />}
      {on ? (saving ? 'Saving…' : `Save${dirtyCount ? ` (${dirtyCount})` : ''}`) : 'Image bank'}
    </button>
  );
}