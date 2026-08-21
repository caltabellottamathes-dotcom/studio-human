import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, Upload, RefreshCw, Check, Image as ImageIcon, Palette } from 'lucide-react';
import { useBeeldbank } from '@/lib/beeldbankContext';
import { imageSlots } from '@/config/imageSlots';
import { base44 } from '@/api/base44Client';

const panelTones = {
  glacier: 'bg-gradient-to-br from-red-100 via-red-200 to-cliff-100',
  cliff: 'bg-gradient-to-br from-cliff-100 via-cliff-200 to-red-100',
  ember: 'bg-gradient-to-br from-ember-100 via-ember-200 to-cliff-100',
  neutral: 'bg-gradient-to-br from-neutral-100 to-neutral-200',
};

const toneList = ['glacier', 'cliff', 'ember', 'neutral'];

function Thumb({ slot }) {
  if (slot.type === 'image' && slot.url) {
    return <img src={slot.url} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />;
  }
  return <div className={`absolute inset-0 ${panelTones[slot.tone] || panelTones.glacier}`} />;
}

export default function BeeldbankModal() {
  const { modalOpen, activeKey, getSlot, setSlot, openSlot, closeSlot, closeModal, dirtyCount } = useBeeldbank();
  const [uploading, setUploading] = useState(false);

  const active = activeKey ? getSlot(activeKey) : null;

  // Pool of every image currently available across the site (+ any uploads assigned).
  const pool = useMemo(() => {
    const set = new Map();
    imageSlots.forEach((s) => {
      const slot = getSlot(s.key);
      if (slot.type === 'image' && slot.url) set.set(slot.url, slot.url);
    });
    return Array.from(set.keys());
  }, [getSlot]);

  const pickImage = (url) => {
    if (!activeKey) return;
    setSlot(activeKey, { type: 'image', url });
  };

  const pickTone = (tone) => {
    if (!activeKey) return;
    setSlot(activeKey, { type: 'panel', tone });
  };

  const onUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f || !activeKey) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file: f });
      setSlot(activeKey, { type: 'image', url: res.file_url });
    } catch (err) {
      console.error('upload failed', err);
    }
    setUploading(false);
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 md:p-8"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-2xl bg-neutral-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 md:px-7 py-4">
              <div className="flex items-center gap-3 min-w-0">
                {activeKey && (
                  <button onClick={closeSlot} className="p-1.5 -ml-1.5 rounded-md hover:bg-neutral-200/60 transition-colors" aria-label="Terug naar overzicht">
                    <ArrowLeft className="w-4 h-4 text-neutral-700" />
                  </button>
                )}
                <h2 className="font-display text-lg md:text-xl text-neutral-800 truncate">
                  {activeKey ? active?.label : 'Beeldbank'}
                </h2>
                {activeKey && (
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 hidden sm:block">
                    {active?.type === 'image' ? 'Foto' : 'Placeholder'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {dirtyCount > 0 && (
                  <span className="text-[11px] uppercase tracking-widest text-neutral-500">{dirtyCount} gewijzigd</span>
                )}
                <button onClick={closeModal} className="p-1.5 rounded-md hover:bg-neutral-200/60 transition-colors" aria-label="Sluiten">
                  <X className="w-5 h-5 text-neutral-700" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 md:p-7">
              {!activeKey ? (
                /* Overview of every slot — click one to edit it */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageSlots.map((s) => {
                    const slot = getSlot(s.key);
                    return (
                      <button key={s.key} onClick={() => openSlot(s.key)} className="group text-left">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-neutral-200">
                          <Thumb slot={slot} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2">
                            <span className="text-[9px] uppercase tracking-[0.15em] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/70 rounded px-1.5 py-0.5">
                              Bewerken
                            </span>
                          </div>
                          <span className="absolute top-2 left-2 text-[8px] uppercase tracking-[0.15em] bg-neutral-900/75 text-white rounded px-1.5 py-0.5">
                            {slot.type === 'image' ? 'Foto' : 'Placeholder'}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] leading-snug text-neutral-700">{s.label}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Picker for the clicked slot */
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 overflow-hidden rounded-md border border-neutral-200 flex-shrink-0">
                      <Thumb slot={active} />
                    </div>
                    <p className="text-sm text-neutral-500 font-light leading-snug">
                      Kies een foto of een placeholder om deze plek te vullen. Je keuze is direct live zichtbaar.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> Foto's
                      </span>
                      <label className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1 text-[10px] uppercase tracking-widest text-neutral-700 hover:border-neutral-400 cursor-pointer transition-colors">
                        {uploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploading ? 'Uploaden…' : 'Uploaden'}
                        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                      </label>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {pool.map((url) => {
                        const selected = active?.type === 'image' && active?.url === url;
                        return (
                          <button key={url} onClick={() => pickImage(url)} className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg border-2 transition-all" style={{ borderColor: selected ? '#171717' : 'transparent' }}>
                            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            {selected && (
                              <span className="absolute bottom-1.5 right-1.5 rounded-full bg-neutral-900 p-1">
                                <Check className="w-3 h-3 text-white" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 mb-3">
                      <Palette className="w-3.5 h-3.5" /> Placeholder kleuren
                    </span>
                    <div className="flex gap-3 flex-wrap">
                      {toneList.map((t) => {
                        const selected = active?.type === 'panel' && active?.tone === t;
                        return (
                          <button
                            key={t}
                            onClick={() => pickTone(t)}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all ${selected ? 'scale-105' : 'hover:scale-105'} ${panelTones[t]}`}
                            style={{ borderColor: selected ? '#171717' : 'transparent' }}
                            aria-label={t}
          >
                            {selected && <Check className="absolute inset-0 m-auto w-4 h-4 text-neutral-800" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}