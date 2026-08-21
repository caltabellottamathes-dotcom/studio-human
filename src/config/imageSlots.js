// Central registry of every editable image / placeholder slot on the public site.
// Pages reference these by `slotKey`; the Beeldbank reads/writes overrides keyed by `key`.

const P = 'https://media.base44.com/images/public/6a863d1d060de4a10b195ae3/';
const S = 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/';

export const imageSlots = [
  { key: 'home.manifesto', label: 'Home — Manifesto', type: 'image', url: P + 'a41713583_Home_2.jpeg' },
  { key: 'home.about', label: 'Home — The practice', type: 'image', url: P + '1c9d3fc4e_Man_with_curly_hair_2K_202608201955.jpeg' },
  { key: 'home.closing', label: 'Home — Closing', type: 'image', url: P + 'ba6e506d5_Home_3.jpeg' },
  { key: 'approach.mid', label: 'Approach — Conversation', type: 'image', url: P + 'a86df7bf1_Remake_photo_with_new_model_202608202132.jpeg' },
  { key: 'approach.closing', label: 'Approach — Closing', type: 'image', url: P + '682227ccd_Gemini_Generated_Image_nnix4xnnix4xnnix.jpg' },
  { key: 'about.portrait', label: 'About — Portrait', type: 'image', url: P + 'a9d0dc67a_Man_leaning_on_foam_2K_202608201954.jpeg' },
  { key: 'about.mid', label: 'About — Middle panel', type: 'panel', tone: 'cliff' },
  { key: 'about.closing', label: 'About — Closing', type: 'image', url: P + '35ec8f9a0_Remake_photo_using_reference_man_202608202022.jpeg' },
  { key: 'concerns.index', label: 'Concerns — Index', type: 'image', url: P + '4e741b653_Man_sitting_against_foam_sheets_202608201954.jpeg' },
  { key: 'pricing.closing', label: 'Pricing — Closing', type: 'image', url: P + '1c9d3fc4e_Man_with_curly_hair_2K_202608201955.jpeg' },
  { key: 'contact.closing', label: 'Contact — Closing', type: 'image', url: P + 'a86df7bf1_Remake_photo_with_new_model_202608202132.jpeg' },
  { key: 'concerns.stress-overwhelm', label: 'Concern — Stress & Overwhelm', type: 'image', url: S + '42b1d4724_generated_image.png' },
  { key: 'concerns.burnout', label: 'Concern — Burnout', type: 'image', url: S + '21edd95a2_generated_image.png' },
  { key: 'concerns.caregiving', label: 'Concern — Caregiving', type: 'image', url: S + 'd567b0e7c_generated_image.png' },
  { key: 'concerns.grief-loss', label: 'Concern — Grief & Loss', type: 'image', url: S + 'aa5459e8e_generated_image.png' },
  { key: 'concerns.life-transitions', label: 'Concern — Life Transitions', type: 'image', url: S + '62cb3ee5c_generated_image.png' },
  { key: 'concerns.emotional-exhaustion', label: 'Concern — Emotional Exhaustion', type: 'image', url: S + 'af1d0a950_generated_image.png' },
  { key: 'struggle.closing', label: 'Concern page — Closing', type: 'image', url: P + 'a9d0dc67a_Man_leaning_on_foam_2K_202608201954.jpeg' },
];

const slotMap = Object.fromEntries(imageSlots.map((s) => [s.key, s]));

export const getSlotDefault = (key) =>
  slotMap[key] || { key, label: key, type: 'image', url: '', tone: 'glacier' };

export const slotKeys = imageSlots.map((s) => s.key);