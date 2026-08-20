# STUDIO HUMAN — Tier delivery map

One Base44 app sold as four cumulative tiers, delivered from a single codebase.
Switch tiers by editing **`src/config/tiers.js` → `ACTIVE_TIER`** (`'1' | '2' | '3' | '4'`).
All routing and footer links gate automatically via `useTier()`; the current
running app is Tier 4 (everything on) and behaves exactly as before.

> **Ordering rationale:** the client portal depends on the admin dashboard that
> feeds it — appointments, documents, messages, and assignments all originate on
> the admin side. So the dashboard ships at **Tier 2** (practice management,
> admin-only) and the portal ships at **Tier 3** on top of it. A portal without a
> dashboard would be an empty shell with no one to populate or respond to it.

## Tiers

| Tier | Name | Marketing | Quiz | Admin/CMS | Portal | Agency license |
|:----:|------|:--:|:--:|:--:|:--:|:--:|
| 1 | Marketing + Quiz | ✅ | ✅ | — | — | — |
| 2 | + Admin Dashboard | ✅ | ✅ | ✅ | — | — |
| 3 | Full Platform | ✅ | ✅ | ✅ | ✅ | — |
| 4 | Agency / Resale | ✅ | ✅ | ✅ | ✅ | ✅ |

Tiers are **cumulative** — each is the full app with some feature flags off.
Nothing diverges into separate branches.

## What ships per tier

### Routes (`src/App.jsx`)
- **Tier 1:** `/`, `/approach`, `/concerns`, `/concerns/:slug`, `/about`, `/pricing`, `/contact`
- **Tier 2:** Tier 1 + `/admin/*` (dashboard, clients, clients/:id, schedule, session-notes, assignments, messages, requests, settings, assessment) + `/admin/login`
- **Tier 3:** Tier 2 + `/portal/*` (dashboard, documents, assignments, appointments, messages, mood, invoices, profile) + `/portal/login`
- **Tier 4:** Tier 3 (unchanged routes) + agency layer

### Entities (`base44/entities/`)
- **Tier 1:** `ContactRequest`, `AssessmentQuestion`, `AssessmentProfile`, `AssessmentCompletion`
- **Tier 2 adds (admin management):** `ClientProfile`, `Appointment`, `SessionNote`, `Assignment`, `AssignmentSubmission`, `SharedDocument`, `Message`, `Invoice`, `Availability`, `Questionnaire`, `AuditLog`
- **Tier 3 adds (client self-service):** `MoodEntry`
- **Tier 4:** no new entities (license/branding is config, not data) — see Phase 4a

### Backend functions (`base44/functions/`)
- **Tier 1:** `getAssessmentData`, `submitAssessment`
- **Tier 2 adds (admin):** `adminGetAppointments`, `adminGetContent`, `adminReviewSubmission`, `adminSaveAppointment`, `adminSaveAssignment`, `adminSaveClient`, `adminSaveSessionNote`, `adminSendMessage`, `adminShareDocument`, `getAdminClientDetail`, `getAdminOverview`
- **Tier 3 adds (client):** `getClientPortalData`, `clientUpdateProfile`, `clientSaveMood`, `clientSubmitAssignment`, `clientRequestAppointmentChange`
- **Tier 4:** Tier 3 functions + `verifyAgencyLicense`

### Files to prune when delivering a lower tier
When you hand over a pruned instance, delete the files for disabled flags **and**
remove their imports from `src/App.jsx` so the build resolves.

- **Tier 3 → Tier 2 (drop portal, keep admin):**
  - `src/pages/portal/*`
  - `base44/functions/getClientPortalData`, `clientUpdateProfile`, `clientSaveMood`, `clientSubmitAssignment`, `clientRequestAppointmentChange`
  - entity `MoodEntry`
  - remove the portal `import` lines + `{hasPortal && …}` block in `src/App.jsx` (or leave gated — safe if files remain)
  - the footer's "Client portal" link is already hidden by the manifest

- **Tier 2 → Tier 1 (drop admin, keep marketing):**
  - `src/pages/admin/*`
  - `src/components/admin/*` (AppointmentFormDialog, AssignmentFormDialog, SessionNoteFormDialog, DocumentFormDialog, CreateClientDialog, AssessmentQuestionManager, AssessmentQuestionEditor, AssessmentProfileManager, AssessmentProfileEditor, AssessmentStats, AssignmentReviewPanel)
  - `base44/functions/admin*` + `getAdminOverview`, `getAdminClientDetail`
  - admin entities (see list above)
  - remove the admin `import` lines + `{hasAdmin && …}` block in `src/App.jsx`
  - the footer's "Admin" link is already hidden by the manifest

> Note: with `ACTIVE_TIER` set lower, the running app simply hides routes/links —
> no file deletion required for a live demo. Pruning is only for the delivered
> file-set so a buyer doesn't receive code they didn't license.

## Tier 2 (admin-only) behavior note
At Tier 2 the admin can create appointments, share documents, send messages, and
assign work — but with no client portal, those records are admin-internal until
the buyer upgrades to Tier 3. The admin mood view (`ClientDetail` mood tab) will
simply be empty, since mood entries are created by clients through the portal.
This is expected and is stated in `SALES.md`.

## Quiz content
The assessment quiz ships **pre-seeded** (6 questions → 7 reflective profiles),
so Tier 1/2 work without manual authoring. Only Tier 2+ can author quiz content
via `/admin/assessment`.

## Rebranding for a buyer (Tier 4 — resale)
Each delivered instance is rebranded by editing:
- `src/config/tiers.js` — set `ACTIVE_TIER`
- `src/config/brand.js` — wordmark, contact email, CTAs, copyright entity (single edit-point; `Logo`, `Header`, `Footer`, `Contact` read via `useBrand()`)
- `index.html` — `<title>`, meta description, favicon
- Theme tokens in `src/index.css` (`--primary`, accent, fonts) + `tailwind.config.js`
- Content copy in `src/data/content.js` (struggles, principles, steps, faqs)

## Agency license layer (Tier 4a)

Tier 4 ships a white-label + license layer so a seller can rebrand and license
each instance:

- **Brand config** — `src/config/brand.js` is the single edit-point for the
  wordmark, contact email, CTAs, and copyright entity. `Logo`, `Header`,
  `Footer`, and `Contact` all read via `useBrand()`, so a buyer rebrands one
  file. (Theme colors/fonts still live in `src/index.css` + `tailwind.config.js`.)
- **License check** — `base44/functions/verifyAgencyLicense` validates an
  HMAC-SHA256 signed license key against the `AGENCY_LICENSE_SECRET` app
  secret. `src/components/LicenseGate` calls it on load (only when the agency
  tier flag is on **and** `BRAND.LICENSE_KEY` is set) and shows a dismissible
  notice only when verification fails. In dev/demo (no key set) it is silent.

### Issuing a license key
A key is `<base64url(payload)>.<base64url(hmac)>` where
`payload = JSON.stringify({ tier: "4", exp: <ms epoch, optional> })`, signed
with the same secret stored in the app's `AGENCY_LICENSE_SECRET`. Example
issuer (run in any JS console with the secret):

```js
const secret = "your-secret"; // must match AGENCY_LICENSE_SECRET
const payload = btoa(JSON.stringify({ tier: "4", exp: Date.now() + 365*864e5 }));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
  { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
const b64url = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const licenseKey = `${payload}.${b64url(sig)}`;
// paste licenseKey into BRAND.LICENSE_KEY in the delivered instance
```

## Phase status
- [x] **Phase 0** — tier manifest + `useTier()` + gated routing/footer
- [x] **Phase 1** — Tier 3 superset finalized; coupling points resolved
- [x] **Phase 2** — verified: no always-present public surface references gated portal/admin routes
- [x] **Phase 3** — verified: same scan; only the gated Footer link + gated route groups reference portal/admin
- [x] **Phase 4a** — agency license layer (white-label brand config + license-key check)
- [x] **Phase 5** — this delivery map
- [x] **Phase 6** — tier reordering (Admin → Tier 2, Portal → Tier 3) to respect dashboard→portal dependency