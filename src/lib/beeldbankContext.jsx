import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getSlotDefault, slotKeys } from '@/config/imageSlots';

const BeeldbankContext = createContext(null);

export function BeeldbankProvider({ children }) {
  const [mode, setMode] = useState(false);
  const [overrides, setOverrides] = useState({});
  const [savedRecords, setSavedRecords] = useState({});
  const [dirty, setDirty] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load persisted overrides (public read).
  useEffect(() => {
    let alive = true;
    base44.entities.SiteAsset.list()
      .then((records) => {
        if (!alive) return;
        const recs = {};
        const ovs = {};
        (records || []).forEach((r) => {
          recs[r.slot_key] = r;
          ovs[r.slot_key] = {
            url: r.url || undefined,
            type: r.slot_type,
            tone: r.tone,
          };
        });
        setSavedRecords(recs);
        setOverrides(ovs);
      })
      .catch((e) => console.error('beeldbank load failed', e));
    return () => { alive = false; };
  }, []);

  const getSlot = useCallback((key) => {
    const def = getSlotDefault(key);
    const ov = overrides[key] || {};
    return {
      key,
      type: ov.type ?? def.type,
      url: ov.url ?? def.url,
      tone: ov.tone ?? def.tone,
      label: def.label,
    };
  }, [overrides]);

  const setSlot = useCallback((key, partial) => {
    setOverrides((prev) => ({ ...prev, [key]: { ...prev[key], ...partial } }));
    setDirty((prev) => new Set(prev).add(key));
  }, []);

  const openSlot = useCallback((key) => {
    setActiveKey(key);
    setModalOpen(true);
  }, []);

  const openGallery = useCallback(() => {
    setActiveKey(null);
    setModalOpen(true);
  }, []);

  const closeSlot = useCallback(() => setActiveKey(null), []);
  const closeModal = useCallback(() => { setModalOpen(false); setActiveKey(null); }, []);

  const saveAll = useCallback(async () => {
    if (saving || dirty.size === 0) return;
    setSaving(true);
    try {
      for (const key of dirty) {
        const def = getSlotDefault(key);
        const ov = overrides[key] || {};
        const type = ov.type ?? def.type;
        const payload = {
          slot_key: key,
          label: def.label,
          url: type === 'panel' ? '' : (ov.url ?? def.url ?? ''),
          slot_type: type,
          tone: ov.tone ?? def.tone ?? 'glacier',
        };
        const existing = savedRecords[key];
        if (existing) {
          const updated = await base44.entities.SiteAsset.update(existing.id, payload);
          setSavedRecords((prev) => ({ ...prev, [key]: updated }));
        } else {
          const created = await base44.entities.SiteAsset.create(payload);
          setSavedRecords((prev) => ({ ...prev, [key]: created }));
        }
      }
      setDirty(new Set());
    } catch (e) {
      console.error('beeldbank save failed', e);
    }
    setSaving(false);
  }, [saving, dirty, overrides, savedRecords]);

  const toggleMode = useCallback(async () => {
    if (mode) {
      await saveAll();
      setMode(false);
      closeModal();
    } else {
      setMode(true);
    }
  }, [mode, saveAll, closeModal]);

  const value = {
    mode,
    toggleMode,
    getSlot,
    setSlot,
    saveAll,
    saving,
    dirtyCount: dirty.size,
    modalOpen,
    activeKey,
    openSlot,
    openGallery,
    closeSlot,
    closeModal,
    slotKeys,
  };

  return <BeeldbankContext.Provider value={value}>{children}</BeeldbankContext.Provider>;
}

export function useBeeldbank() {
  const ctx = useContext(BeeldbankContext);
  if (!ctx) throw new Error('useBeeldbank must be used within BeeldbankProvider');
  return ctx;
}