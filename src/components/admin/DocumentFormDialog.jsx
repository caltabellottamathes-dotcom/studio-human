import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, Loader2 } from 'lucide-react';

export default function DocumentFormDialog({ open, onClose, client, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFileUrl(result.file_url);
      setFileType(file.type || file.name.split('.').pop() || '');
    } catch (err) {
      setError('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminShareDocument', {
        client_id: client.user_id,
        client_name: `${client.first_name} ${client.last_name}`,
        title: form.title,
        description: form.description,
        category: form.category,
        file_url: fileUrl,
        file_type: fileType
      });
      onSaved();
      onClose();
      setForm({ title: '', description: '', category: 'other' });
      setFileUrl('');
      setFileType('');
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
          <DialogTitle className="font-display text-lg">Share document</DialogTitle>
        </DialogHeader>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Title</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Intake report" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Category</Label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full mt-1 border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white">
              <option value="intake">Intake</option>
              <option value="report">Report</option>
              <option value="exercise">Exercise</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">Description</Label>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-500">File</Label>
            <div className="mt-1 border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center">
              {fileUrl ? (
                <p className="text-sm text-emerald-600">✓ File uploaded</p>
              ) : uploading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-5 h-5 mx-auto text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-500">Click to upload</span>
                  <input type="file" className="hidden" onChange={handleFile} />
                </label>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !fileUrl || !form.title} className="flex-1 bg-neutral-900 hover:bg-black">
              {saving ? 'Saving...' : 'Share'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}