# STUDIO HUMAN — Per-Sale Provisioning Checklist

Run through this list for every sale, in order.

## 1. Pre-sale
- [ ] Confirm tier sold and price received
- [ ] Collect buyer's practice name, tagline, contact email, phone, address, domain
- [ ] Collect brand preferences (if rebranding add-on): fonts, color, imagery direction
- [ ] Collect buyer's Base44 workspace access (or create one for them)

## 2. Provision the instance
- [ ] Create a new Base44 app from this template
- [ ] Set `ACTIVE_TIER` in `src/config/tiers.js` to the purchased tier
  - Tier 1 → `portal: false, admin: false`
  - Tier 2 → `admin: true, portal: false` (admin dashboard only)
  - Tier 3 → `admin: true, portal: true` (full platform)
  - Tier 4 → Tier 3 + `agency: true`
- [ ] Update `src/config/brand.js` with the buyer's name, tagline, contact, and any color/font overrides
- [ ] If Tier 1: confirm no portal/admin routes are exposed (tier flags handle this automatically)
- [ ] If Tier 2: confirm admin login works and the admin dashboard loads; seed any demo data the buyer requested
- [ ] If Tier 3: confirm both admin and client login flows work end-to-end

## 3. License (Tier 4a only)
- [ ] Generate a license key using the `AGENCY_LICENSE_SECRET` and the buyer's workspace identifier / domain (see `TIERS.md` → Issuing a license key)
- [ ] Record the key in your sales ledger: buyer, tier, key, issue date
- [ ] Provide the key to the buyer and instruct them to enter it on first load
- [ ] Confirm the LicenseGate shows no warning after entry

## 4. Content & data
- [ ] Replace any placeholder copy with the buyer's final content
- [ ] Seed `AssessmentProfile` and `AssessmentQuestion` records (or confirm defaults are acceptable)
- [ ] Configure availability, pricing, and service offerings in admin settings
- [ ] Remove all mock/demo client data before handover

## 5. Deploy & handover
- [ ] Connect the buyer's custom domain
- [ ] Verify the live site on desktop and mobile
- [ ] Test the self-reflection quiz end-to-end
- [ ] Tier 2+: test the admin flow — login → create client → schedule appointment → send message
- [ ] Tier 3: test the full client flow — register → login → portal → logout
- [ ] Send the buyer: live URL, admin credentials, and (Tier 4a) license key

## 6. Post-delivery
- [ ] Log the sale: date, buyer, tier, license key, delivery date, support expiry
- [ ] Provide a short walkthrough (written or recorded) of the admin dashboard
- [ ] Start the 14-day bug-fix support window
- [ ] Offer the extended-support retainer

## Pruning reference (for delivered file-sets)
When handing over a pruned instance so the buyer doesn't receive unlicensed
code, follow the pruning map in `TIERS.md`:
- **Tier 3 → Tier 2:** drop portal pages, client functions, `MoodEntry`
- **Tier 2 → Tier 1:** drop admin pages, admin components, admin functions, admin entities