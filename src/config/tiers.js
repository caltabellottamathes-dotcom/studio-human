// Tier manifest — single source of truth for which feature areas ship per tier.
// Flip ACTIVE_TIER per delivered instance: '1' | '2' | '3' | '4'
//   1 — Marketing site + assessment quiz
//   2 — + Client Portal
//   3 — Full platform (+ Admin portal, session notes, scheduling, audit logs, assessment CMS)
//   4 — Agency / resale license (right to reuse for unlimited client projects)

export const ACTIVE_TIER = '4';

export const TIERS = {
  '1': { name: 'Marketing + Quiz',          assessment: true,  portal: false, admin: false, agency: false },
  '2': { name: 'Marketing + Quiz + Portal', assessment: true,  portal: true,  admin: false, agency: false },
  '3': { name: 'Full Platform',            assessment: true,  portal: true,  admin: true,  agency: false },
  '4': { name: 'Agency / Resale',          assessment: true,  portal: true,  admin: true,  agency: true  },
};

export const getTierConfig = (tier = ACTIVE_TIER) => TIERS[tier] || TIERS['4'];