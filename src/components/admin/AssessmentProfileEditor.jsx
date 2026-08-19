import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fields = [
  { key: 'title', label: 'Titel', type: 'input', placeholder: 'Kop die de bezoeker ziet' },
  { key: 'reflection', label: 'Reflectie', type: 'textarea', placeholder: 'Warme, gepersonaliseerde paragraaf' },
  { key: 'recognition', label: 'Herkenning', type: 'textarea', placeholder: 'Benoem hun situatie' },
  { key: 'encouragement', label: 'Aanmoediging', type: 'textarea', placeholder: 'Ondersteunende boodschap' },
  { key: 'how_debora_helps', label: 'Hoe Debora helpt', type: 'textarea', placeholder: 'Uitleg van de aanpak' },
  { key: 'invitation', label: 'Uitnodiging', type: 'textarea', placeholder: 'Zachte oproep tot actie' },
];

const struggleOptions = [
  { value: '', label: '— Geen —' },
  { value: 'stress-overwhelm', label: 'Stress & Overweldiging' },
  { value: 'burnout', label: 'Burn-out' },
  { value: 'caregiving', label: 'Mantelzorg' },
  { value: 'grief-loss', label: 'Rouw & Verlies' },
  { value: 'life-transitions', label: 'Levensovergangen' },
  { value: 'emotional-exhaustion', label: 'Emotionele Uitputting' },
];

export default function AssessmentProfileEditor({ open, profile, onClose, onSaved }) {
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(profile
      ? { ...profile }
      : { profile_key: '', title: '', reflection: '', recognition: '', encouragement: '', how_debora_helps: '', invitation: '', related_slug: '', priority: 10 }
    );
  }, [profile, open]);

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        profile_key: data.profile_key?.trim(),
        title: data.title?.trim(),
        reflection: data.reflection?.trim() || '',
        recognition: data.recognition?.trim() || '',
        encouragement: data.encouragement?.trim() || '',
        how_debora_helps: data.how_debora_helps?.trim() || '',
        invitation: data.invitation?.trim() || '',
        related_slug: data.related_slug || '',
        priority: data.priority || 10,
        is_active: true
      };
      if (profile) await base44.entities.AssessmentProfile.update(profile.id, payload);
      else await base44.entities.AssessmentProfile.create(payload);
      onSaved();
      onClose();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{profile ? 'Profiel bewerken' : 'Nieuw profiel'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Profielsleutel</Label>
            <Input
              value={data.profile_key || ''}
              onChange={e => set('profile_key', e.target.value)}
              disabled={!!profile}
              placeholder="bv. stress_overwhelm"
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-neutral-400">Unieke identificatie gebruikt in antwoordgewichten. Kan na aanmaken niet gewijzigd worden.</p>
          </div>
          {fields.map(f => (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              {f.type === 'input' ? (
                <Input value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              ) : (
                <textarea
                  value={data[f.key] || ''}
                  onChange={e => set(f.key, e.target.value)}
                  rows={3}
                  placeholder={f.placeholder}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              )}
            </div>
          ))}
          <div className="space-y-2">
            <Label>Gerelateerde zorgvraag</Label>
            <select
              value={data.related_slug || ''}
              onChange={e => set('related_slug', e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {struggleOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-neutral-400">De zorgvraag-pagina waar de bezoeker naartoe geleid wordt na de reflectie.</p>
          </div>
          <div className="space-y-2">
            <Label>Prioriteit (lager wint bij gelijkspel)</Label>
            <Input
              type="number"
              value={data.priority || 10}
              onChange={e => set('priority', parseInt(e.target.value) || 10)}
              className="w-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Annuleren</Button>
          <Button onClick={handleSave} disabled={saving || !data.profile_key?.trim() || !data.title?.trim()}>
            {saving ? 'Opslaan...' : 'Profiel opslaan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}