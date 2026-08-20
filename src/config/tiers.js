// Tier manifest — single source of truth for which feature areas ship per tier.
// Flip ACTIVE_TIER per delivered instance: '1' | '2' | '3' | '4'
//   1 — Marketing site + assessment quiz
//   2 — + Admin Dashboard (practice management; no client self-service)
//   3 — Full Platform (+ Client Portal — clients self-serve on top of the admin dashboard)
//   4 — Agency / resale license (right to reuse for unlimited client projects)
//
// Rationale: the client portal depends on the admin dashboard that feeds it
// (appointments, documents, messages, assignments all originate on the admin
// side), so the dashboard ships at Tier 2 — before the portal at Tier 3.

export const ACTIVE_TIER = '1';

export const TIERS = {
  '1': { name: 'Marketing + Quiz',          assessment: true,  portal: false, admin: false, agency: false },
  '2': { name: 'Marketing + Quiz + Admin',  assessment: true,  portal: false, admin: true,  agency: false },
  '3': { name: 'Full Platform',            assessment: true,  portal: true,  admin: true,  agency: false },
  '4': { name: 'Agency / Resale',          assessment: true,  portal: true,  admin: true,  agency: true  },
};

export const getTierConfig = (tier = ACTIVE_TIER) => TIERS[tier] || TIERS['4'];