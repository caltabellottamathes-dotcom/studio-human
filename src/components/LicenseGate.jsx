import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTier } from '@/hooks/useTier';
import { BRAND } from '@/config/brand';

// Tier 4 (Agency) license gate. Silent in dev/demo (no LICENSE_KEY set) and
// silent when the license verifies. Only surfaces a dismissible notice when a
// key is present but the seller-side verification fails (invalid/expired).
export default function LicenseGate() {
  const { agency } = useTier();
  const [status, setStatus] = useState('idle'); // idle | valid | invalid
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!agency || !BRAND.LICENSE_KEY) return;
    let active = true;
    base44.functions
      .invoke('verifyAgencyLicense', { licenseKey: BRAND.LICENSE_KEY })
      .then((res) => {
        if (!active) return;
        if (res.data?.valid) setStatus('valid');
        else {
          setStatus('invalid');
          setMessage(res.data?.message || 'License could not be verified.');
        }
      })
      .catch((e) => {
        if (!active) return;
        setStatus('invalid');
        setMessage(e?.message || 'License check failed.');
      });
    return () => {
      active = false;
    };
  }, [agency]);

  if (!agency || !BRAND.LICENSE_KEY || status !== 'invalid' || dismissed) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[30rem] z-[100] bg-neutral-900 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3"
    >
      <div className="flex-1">
        <p className="text-sm font-medium mb-1 text-amber-300">License notice</p>
        <p className="text-xs leading-relaxed text-white/70">
          {message} This instance's agency license could not be verified — please
          contact the studio that issued this template.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss license notice"
        className="text-white/50 hover:text-white transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}