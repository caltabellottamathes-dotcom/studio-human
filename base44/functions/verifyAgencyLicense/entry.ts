import { secrets } from "base44:runtime";

// Decodes a base64url string to a Uint8Array.
function b64urlDecode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Validates a Tier 4 (Agency / Resale) license key.
// Key format: "<base64url(payload)>.<base64url(hmac-sha256(secret, payload))>"
// payload (JSON): { tier: string, exp?: number (ms epoch) }
export default async function (req) {
  try {
    const secret = secrets.get('AGENCY_LICENSE_SECRET');
    if (!secret) {
      return Response.json({ valid: false, message: 'License verification is not configured.' });
    }

    const body = await req.json().catch(() => ({}));
    const licenseKey = body?.licenseKey;
    if (!licenseKey || typeof licenseKey !== 'string') {
      return Response.json({ valid: false, message: 'No license key provided.' });
    }

    const parts = licenseKey.split('.');
    if (parts.length !== 2) {
      return Response.json({ valid: false, message: 'Invalid license format.' });
    }
    const [payloadB64, sigB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = b64urlDecode(sigB64);
    const ok = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payloadB64));
    if (!ok) {
      return Response.json({ valid: false, message: 'License signature is invalid.' });
    }

    let payload;
    try {
      payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return Response.json({ valid: false, message: 'License payload is unreadable.' });
    }

    if (payload.exp && Date.now() > payload.exp) {
      return Response.json({ valid: false, message: 'License has expired.' });
    }

    return Response.json({ valid: true, tier: payload.tier, exp: payload.exp || null });
  } catch (error) {
    return Response.json({ valid: false, message: error.message }, { status: 500 });
  }
}