import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, Upload, RefreshCw, Check } from 'lucide-react';
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
  const { modalOpen, activeKey, getSlot, setSlot, openSlot, closeSlot, closeModal, dirtyCount, saving } = useBeeldbank();
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (activeKey) {
      const s = getSlot(activeKey);
      setForm({ type: s.type, url: s.url || '', tone: s.tone || 'glacier' });
    } else {
      setForm(null);
    }
  }, [activeKey]); // eslint-disable-line

  const apply = () => {
    if (!activeKey || !form) return;
    setSlot(activeKey, {
      type: form.type,
      url: form.type === 'image' ? form.url : '',
      tone: form.tone,
    });
    closeSlot();
  };

  const onUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file: f });
      setForm((p) => ({ ...p, url: res.file_url, type: 'image' }));
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
              <div className="flex items-center gap-3">
                {activeKey && (
                  <button onClick={closeSlot} className="p-1.5 -ml-1.5 rounded-md hover:bg-neutral-200/60 transition-colors" aria-label="Back to gallery">
                    <ArrowLeft className="w-4 h-4 text-neutral-700" />
                  </button>
                )}
                <h2 className="font-display text-lg md:text-xl text-neutral-800">
                  {activeKey ? getSlot(activeKey).label : 'Beeldbank'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {dirtyCount > 0 && (
                  <span className="text-[11px] uppercase tracking-widest text-neutral-500">
                    {dirtyCount} gewijzigd
                  </span>
                )}
                <button onClick={closeModal} className="p-1.5 rounded-md hover:bg-neutral-200/60 transition-colors" aria-label="Close">
                  <X className="w-5 h-5 text-neutral-700" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 md:p-7">
              {!activeKey ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageSlots.map((s) => {
                    const slot = getSlot(s.key);
                    return (
                      <button
                        key={s.key}
                        onClick={() => openSlot(s.key)}
                        className="group text-left"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-neutral-200">
                          <Thumb slot={slot} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2">
                            <span className="text-[9px] uppercase tracking-[0.15em] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/70 rounded px-1.5 py-0.5">
                              Bewerken
                            </span>
                          </div>
                          <span className="absolute top-2 left-2 text-[8px] uppercase tracking-[0.15em] bg-neutral-900/75 text-white rounded px-1.5 py-0.5">
                            {slot.type === 'image' ? 'Image' : 'Panel'}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] leading-snug text-neutral-700">{s.label}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-neutral-200">
                    {form?.type === 'image' && form.url ? (
                      <img src={form.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className={`absolute inset-0 ${panelTones[form?.tone] || panelTones.glacier}`} />
                    )}
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-neutral-500 block mb-2">Type</label>
                      <div className="flex gap-2">
                        {['image', 'panel'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setForm((p) => ({ ...p, type: t }))}
                            className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest border transition-colors ${
                              form?.type === t ? 'bg-neutral-900 text-neutral-50 border-neutral-900' : 'bg-transparent text-neutral-700 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            {t === 'image' ? 'Foto' : 'Placeholder'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form?.type === 'image' && (
                      <>
                        <div>
                          <label className="text-[11px] uppercase tracking-widest text-neutral-500 block mb-2">Afbeelding URL</label>
                          <input
                            type="text"
                            value={form.url}
                            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                            placeholder="https://…"
                            className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-2 text-sm text-neutral-800 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-widest text-neutral-500 block mb-2">Of upload een nieuwe foto</label>
                          <label className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 text-[11px] uppercase tracking-widest text-neutral-700 hover:border-neutral-400 cursor-pointer transition-colors">
                            {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            {uploading ? 'Uploaden…' : 'Uploaden'}
                            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                          </label>
                        </div>
                      </>
                    )}

                    {form?.type === 'panel' && (
                      <div>
                        <label className="text-[11px] uppercase tracking-widest text-neutral-500 block mb-2">Gradient kleur</label>
                        <div className="flex gap-2 flex-wrap">
                          {toneList.map((t) => (
                            <button
                              key={t}
                              onClick={() => setForm((p) => ({ ...p, tone: t }))}
                              className={`w-9 h-9 rounded-full border-2 transition-all ${form?.tone === t ? 'border-neutral-900 scale-105' : 'border-transparent'} ${panelTones[t]}`}
                              aria-label={t}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={apply}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[11px] uppercase tracking-widest text-neutral-50 hover:bg-black transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Toepassen
                      </button>
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