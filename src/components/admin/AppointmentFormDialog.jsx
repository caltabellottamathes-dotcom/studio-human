import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AppointmentFormDialog({ open, onClose, client, onSaved, editing }) {
  const [form, setForm] = useState({
    date: editing?.date || '',
    start_time: editing?.start_time || '',
    duration_minutes: editing?.duration_minutes || 60,
    type: editing?.type || 'session',
    location: editing?.location || '',
    price: editing?.price || 0,
    client_visible_notes: editing?.client_visible_notes || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminSaveAppointment', {
        id: editing?.id,
        client_id: client.user_id,
        client_name: `${client.first_name} ${client.last_name}`,
        ...form
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message || 'Er ging iets mis');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Nieuwe afspraak</DialogTitle>
        </DialogHeader>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Datum</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Tijd</Label>
              <Input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Duur (min)</Label>
              <Input type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', parseInt(e.target.value) || 60)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Prijs (€)</Label>
              <Input type="number" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Type</Label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full mt-1 border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white">
              <option value="intake">Intakegesprek</option>
              <option value="session">Sessie</option>
              <option value="online">Online</option>
              <option value="physical">Fysiek</option>
              <option value="phone">Telefoon</option>
            </select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Locatie</Label>
            <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Praktijk / Online / ..." className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Notitie voor cliënt</Label>
            <Textarea value={form.client_visible_notes} onChange={e => set('client_visible_notes', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Annuleren</Button>
            <Button onClick={handleSave} disabled={saving || !form.date || !form.start_time} className="flex-1 bg-neutral-900 hover:bg-black">
              {saving ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}