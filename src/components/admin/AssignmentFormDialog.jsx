import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AssignmentFormDialog({ open, onClose, client, onSaved, editing }) {
  const [form, setForm] = useState({
    title: editing?.title || '',
    description: editing?.description || '',
    type: editing?.type || 'homework',
    instructions: editing?.instructions || '',
    due_date: editing?.due_date || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminSaveAssignment', {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">New assignment</DialogTitle>
        </DialogHeader>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Title</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Keep a mood journal" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Type</Label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full mt-1 border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white">
              <option value="homework">Homework</option>
              <option value="reflection">Reflection exercise</option>
              <option value="exercise">Exercise</option>
              <option value="reading">Reading</option>
            </select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Description</Label>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Instructions</Label>
            <Textarea value={form.instructions} onChange={e => set('instructions', e.target.value)} rows={3} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Due date</Label>
            <Input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} className="mt-1" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title} className="flex-1 bg-neutral-900 hover:bg-black">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}