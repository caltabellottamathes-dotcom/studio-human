import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CreateClientDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = create, 2 = verify OTP
  const [createdEmail, setCreatedEmail] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminSaveClient', { action: 'create', ...form });
      setCreatedEmail(form.email);
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('adminSaveClient', { action: 'verify', email: createdEmail, otpCode });
      if (onCreated) onCreated();
      setTimeout(() => handleClose(), 2000);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Invalid verification code');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm({ first_name: '', last_name: '', email: '', password: '' });
    setOtpCode('');
    setError('');
    setStep(1);
    setCreatedEmail('');
    onClose();
  };

  const canSubmit = form.first_name && form.last_name && form.email && form.password.length >= 8;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {step === 1 ? 'Create new client' : 'Verify account'}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            {step === 1
              ? 'The account is created immediately with this password. Hand the login details to the client manually.'
              : 'The client received a verification code by email. Ask for the code and enter it to activate the account.'}
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-widest text-neutral-500">First name</Label>
                <Input name="first_name" value={form.first_name} onChange={handleChange} className="mt-1" autoFocus />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-neutral-500">Last name</Label>
                <Input name="last_name" value={form.last_name} onChange={handleChange} className="mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Email address</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" className="mt-1" />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">At least 8 characters. You can hand this password to the client manually.</p>
              </div>

              <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button onClick={handleCreate} disabled={saving || !canSubmit} className="flex-1 bg-neutral-900 hover:bg-black">
                {saving ? 'Creating...' : 'Create client'}
              </Button>
              </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-700 text-xs">
              <Mail className="w-4 h-4 flex-shrink-0" />
              A verification code was sent to <strong>{createdEmail}</strong>. Ask the client for the code.
            </div>

            <div>
              <Label className="text-xs uppercase tracking-widest text-neutral-500">Verification code</Label>
              <Input
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-digit code"
                className="mt-1 text-center text-lg tracking-widest"
                maxLength={6}
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Close</Button>
              <Button onClick={handleVerify} disabled={saving || otpCode.length < 4} className="flex-1 bg-neutral-900 hover:bg-black">
                {saving ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}