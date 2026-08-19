import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, MapPin, AlertCircle, Shield, Check } from 'lucide-react';

export default function PortalProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = async () => {
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
      setForm(response.data?.profile || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await base44.functions.invoke('clientUpdateProfile', form);
      setSaved(true);
      fetchData();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const profile = data?.profile;
  const user = data?.user;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Cliëntportaal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Mijn Profiel</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">Beheer je persoonsgegevens en noodcontact.</p>
      </div>

      {/* Account info (read-only) */}
      <div className="bg-neutral-100/60 rounded-xl border border-neutral-200 p-5 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400">Account</p>
          <p className="text-sm text-neutral-700">{user?.email}</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="font-display text-lg text-neutral-800 mb-4">Persoonsgegevens</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Voornaam</Label><Input value={form.first_name || ''} onChange={e => set('first_name', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Achternaam</Label><Input value={form.last_name || ''} onChange={e => set('last_name', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Geboortedatum</Label><Input type="date" value={form.date_of_birth || ''} onChange={e => set('date_of_birth', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Telefoon</Label><Input value={form.phone || ''} onChange={e => set('phone', e.target.value)} className="mt-1" /></div>
          <div className="col-span-2"><Label className="text-xs uppercase tracking-widest text-neutral-500">Adres</Label><Input value={form.address || ''} onChange={e => set('address', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Postcode</Label><Input value={form.postal_code || ''} onChange={e => set('postal_code', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Stad</Label><Input value={form.city || ''} onChange={e => set('city', e.target.value)} className="mt-1" /></div>
        </div>
      </div>

      {/* Emergency contact */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
          <h2 className="font-display text-lg text-neutral-800">Noodcontact</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Naam</Label><Input value={form.emergency_contact_name || ''} onChange={e => set('emergency_contact_name', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Telefoon</Label><Input value={form.emergency_contact_phone || ''} onChange={e => set('emergency_contact_phone', e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Relatie</Label><Input value={form.emergency_contact_relation || ''} onChange={e => set('emergency_contact_relation', e.target.value)} className="mt-1" /></div>
        </div>
      </div>

      {/* Consent info (read-only) */}
      {profile && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
            <h2 className="font-display text-lg text-neutral-800">Toestemmingen</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {profile.consent_treatment ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-neutral-300" />}
              <span className="text-neutral-600 font-light">Toestemming voor behandeling</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {profile.consent_data_processing ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-neutral-300" />}
              <span className="text-neutral-600 font-light">Toestemming voor gegevensverwerking</span>
            </div>
            {profile.consent_date && (
              <p className="text-xs text-neutral-400 mt-2">Verleend op: {new Date(profile.consent_date).toLocaleDateString('nl-NL')}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="bg-neutral-900 hover:bg-black px-8">
          {saving ? 'Opslaan...' : 'Profiel opslaan'}
        </Button>
        {saved && <span className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Opgeslagen</span>}
      </div>
    </div>
  );
}