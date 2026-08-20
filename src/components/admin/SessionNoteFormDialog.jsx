import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function SessionNoteFormDialog({ open, onClose, client, onSaved, editing }) {
  const [form, setForm] = useState({
    session_date: editing?.session_date || new Date().toISOString().split('T')[0],
    summary: editing?.summary || '',
    observations: editing?.observations || '',
    interventions: editing?.interventions || '',
    treatment_plan: editing?.treatment_plan || '',
    risk_assessment: editing?.risk_assessment || '',
    private_notes: editing?.private_notes || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminSaveSessionNote', {
        id: editing?.id,
        client_id: client.user_id,
        client_name: `${client.first_name} ${client.last_name}`,
        ...form
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Session note</DialogTitle>
          <p className="text-xs text-red-600/70 uppercase tracking-widest">Private — not visible to client</p>
        </DialogHeader>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Session date</Label>
            <Input type="date" value={form.session_date} onChange={e => set('session_date', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Summary</Label>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Observations</Label>
            <Textarea value={form.observations} onChange={e => set('observations', e.target.value)} rows={3} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Interventions</Label>
            <Textarea value={form.interventions} onChange={e => set('interventions', e.target.value)} rows={3} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Treatment plan</Label>
            <Textarea value={form.treatment_plan} onChange={e => set('treatment_plan', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Risk assessment</Label>
            <Textarea value={form.risk_assessment} onChange={e => set('risk_assessment', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Private notes</Label>
            <Textarea value={form.private_notes} onChange={e => set('private_notes', e.target.value)} rows={3} className="mt-1" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-neutral-900 hover:bg-black">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}