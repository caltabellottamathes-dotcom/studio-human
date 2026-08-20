import { getTierConfig, ACTIVE_TIER } from '@/config/tiers';

// Reads the active tier manifest. Feature flags: assessment, portal, admin, agency.
export function useTier() {
  const config = getTierConfig(ACTIVE_TIER);
  return { tier: ACTIVE_TIER, ...config };
}