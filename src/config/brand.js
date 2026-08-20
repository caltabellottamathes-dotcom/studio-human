// STUDIO HUMAN — Brand config (single edit-point for white-label delivery)
// To rebrand an instance, edit these values + ACTIVE_TIER (src/config/tiers.js)
// + theme tokens (src/index.css / tailwind.config.js). Brand-visible surfaces
// (Logo, Header, Footer, Contact) read from here.
export const BRAND = {
  name: 'studioHuman', // wordmark shown in header / footer / logo
  contact: {
    email: 'hello@studiohuman.com',
    mode: 'In person & online',
  },
  cta: {
    primary: 'Book a session',
    reflect: 'Self-reflection',
  },
  legal: {
    copyrightEntity: 'studioHuman',
  },
  // Agency/resale license key — set by the seller when delivering a Tier 4
  // instance. Leave empty in dev/demo; the license gate stays silent when empty.
  LICENSE_KEY: '',
};

export const getBrand = () => BRAND;