# STUDIO HUMAN — Tier delivery map

One Base44 app sold as four cumulative tiers, delivered from a single codebase.
Switch tiers by editing **`src/config/tiers.js` → `ACTIVE_TIER`** (`'1' | '2' | '3' | '4'`).
All routing and footer links gate automatically via `useTier()`; the current
running app is Tier 4 (everything on) and behaves exactly as before.

## Tiers

| Tier | Name | Marketing | Quiz | Portal | Admin/CMS | Agency license |
|:----:|------|:--:|:--:|:--:|:--:|:--:|
| 1 | Marketing + Quiz | ✅ | ✅ | — | — | — |
| 2 | + Client Portal | ✅ | ✅ | ✅ | — | — |
| 3 | Full Platform | ✅ | ✅ | ✅ | ✅ | — |
| 4 | Agency / Resale | ✅ | ✅ | ✅ | ✅ | ✅ |

Tiers are **cumulative** — each is the full app with some feature flags off.
Nothing diverges into separate branches.

## What ships per tier

### Routes (`src/App.jsx`)
- **Tier 1:** `/`, `/approach`, `/concerns`, `/concerns/:slug`, `/about`, `/pricing`, `/contact`
- **Tier 2:** Tier 1 + `/portal/*` (dashboard, documents, assignments, appointments, messages, mood, invoices, profile) + `/portal/login`
- **Tier 3:** Tier 2 + `/admin/*` (dashboard, clients, clients/:id, schedule, session-notes, assignments, messages, requests, settings, assessment) + `/admin/login`
- **Tier 4:** Tier 3 (unchanged routes) + agency layer

### Entities (`base44/entities/`)
- **Tier 1:** `ContactRequest`, `AssessmentQuestion`, `AssessmentProfile`, `AssessmentCompletion`
- **Tier 2 adds:** `ClientProfile`, `Appointment`, `Message`, `Assignment`, `AssignmentSubmission`, `SharedDocument`, `MoodEntry`, `Invoice`, `Availability`, `Questionnaire`
- **Tier 3 adds:** `SessionNote`, `AuditLog`
- **Tier 4:** no new entities (license/branding is config, not data) — see Phase 4a

### Backend functions (`base44/functions/`)
- **Tier 1:** `getAssessmentData`, `submitAssessment`
- **Tier 2 adds:** `getClientPortalData`, `clientUpdateProfile`, `clientSaveMood`, `clientSubmitAssignment`, `clientRequestAppointmentChange`
- **Tier 3 adds:** `adminGetAppointments`, `adminGetContent`, `adminReviewSubmission`, `adminSaveAppointment`, `adminSaveAssignment`, `adminSaveClient`, `adminSaveSessionNote`, `adminSendMessage`, `adminShareDocument`, `getAdminClientDetail`, `getAdminOverview`
- **Tier 4:** same functions as Tier 3

### Files to prune when delivering a lower tier
When you hand over a pruned instance, delete the files for disabled flags **and**
remove their imports from `src/App.jsx` so the build resolves.

- **Tier 3 → Tier 2 (drop admin):**
  - `src/pages/admin/*`
  - `src/components/admin/*` (AppointmentFormDialog, AssignmentFormDialog, SessionNoteFormDialog, DocumentFormDialog, CreateClientDialog, AssessmentQuestionManager, AssessmentQuestionEditor, AssessmentProfileManager, AssessmentProfileEditor, AssessmentStats, AssignmentReviewPanel)
  - `base44/functions/admin*` + `getAdminOverview`, `getAdminClientDetail`
  - entities `SessionNote`, `AuditLog`
  - remove the admin `import` lines + `{hasAdmin && …}` block in `src/App.jsx` (or leave gated — safe if files remain)

- **Tier 2 → Tier 1 (drop portal):**
  - `src/pages/portal/*`
  - `src/components/SecureLayout.jsx`, `src/components/RoleRoute.jsx`, `src/components/PortalAuthLayout.jsx`
  - `base44/functions/getClientPortalData`, `clientUpdateProfile`, `clientSaveMood`, `clientSubmitAssignment`, `clientRequestAppointmentChange`
  - portal entities (see list above)
  - remove the portal `import` lines + `{hasPortal && …}` block in `src/App.jsx`
  - the footer's "Client portal" link is already hidden by the manifest

> Note: with `ACTIVE_TIER` set lower, the running app simply hides routes/links —
> no file deletion required for a live demo. Pruning is only for the delivered
> file-set so a buyer doesn't receive code they didn't license.

## Quiz content
The assessment quiz ships **pre-seeded** (6 questions → 7 reflective profiles),
so Tier 1/2 work without the Admin Assessment CMS. Only Tier 3+ can author quiz
content via `/admin/assessment`.

## Rebranding for a buyer (Tier 4 — resale)
Each delivered instance is rebranded by editing:
- `src/config/tiers.js` — set `ACTIVE_TIER`
- `index.html` — `<title>`, meta description, favicon
- Brand strings: "studioHuman" in `src/components/Header.jsx`, `Footer.jsx`, `src/components/Logo.jsx`
- Contact email in `src/components/Footer.jsx` (`hello@studiohuman.com`)
- Theme tokens in `src/index.css` (`--primary`, accent, fonts) + `tailwind.config.js`
- Content copy in `src/data/content.js` (struggles, principles, steps, faqs)

## Phase status
- [x] **Phase 0** — tier manifest + `useTier()` + gated routing/footer
- [x] **Phase 1** — Tier 3 superset finalized; coupling points resolved
- [ ] **Phase 2** — verify Tier 2 build (manifest only, no pruning needed)
- [ ] **Phase 3** — verify Tier 1 build
- [ ] **Phase 4a** — agency license layer (white-label brand config + license-key check)
- [x] **Phase 5** — this delivery map