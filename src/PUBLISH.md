# Studio Human — Templates publiceren (stappenplan)

Dit plan zet de master-app (alles aan, `ACTIVE_TIER='4'`) om in **drie betaalde
templates** in de Base44-marktplaats — één per tier — zodat een koper alleen de
code krijgt die bij zijn tier hoort.

> Belangrijk: ik kan vanuit deze code-sandbox **geen** nieuwe apps aanmaken,
> publiceren of marktplaats-listings maken. Die stappen doe jij in het Base44
> dashboard. Onderstaande gids geeft de exacte volgorde en de exacte
> bestanden/regels die je per kopie moet weghalen, zodat het snoeien foutloos gaat.

## Vooraf (eenmalig)
- [ ] Je staat op een **Starter-plan of hoger** (vereist voor betaalde listings).
- [ ] De master-app is minstens **één keer gepubliceerd** (vereist voor een template).
- [ ] `TIERS.md`, `SALES.md`, `PROVISIONING.md` zijn up-to-date (zijn ze).

## Algemene volgorde (herhaal per tier)
1. **Dupliceer** de master-app in het dashboard → je krijgt een schone kopie.
2. **Hernoem** de kopie naar de tier (zie namen hieronder).
3. **Snoei** de kopie volgens de lijst voor die tier (zie hieronder).
4. Zet `src/config/tiers.js` → `ACTIVE_TIER` op de juiste waarde.
5. **Publiceer** de gesnoeide app.
6. Maak **screenshots** van de gepubliceerde app.
7. **Dashboard → Settings → App Template → Public template → Create**, vul
   naam/omschrijving/categorie/prijs in, upload screenshots, verstuur voor review.
8. Wacht op goedkeuring door Base44.

---

## Tier 1 — "Studio Human — Marketing"
Marketing + zelfreflectie. Geen portal, geen admin.

**ACTIVE_TIER = '1'**

Verwijder deze mappen/bestanden:
- `src/pages/portal/*` (alles)
- `src/pages/admin/*` (alles)
- `src/components/admin/*` (alles)
- `src/components/SecureLayout.jsx`, `src/components/RoleRoute.jsx`, `src/components/PortalAuthLayout.jsx`
- `src/components/LicenseGate.jsx` (agency-laag hoort niet bij de verkoop-tiers)
- `base44/functions/` alles **behalve** `getAssessmentData`, `submitAssessment`
- `base44/entities/` alles **behalve** `ContactRequest`, `AssessmentQuestion`, `AssessmentProfile`, `AssessmentCompletion`

In `src/App.jsx` verwijderen:
- alle `import ... from '@/pages/portal/...'` regels
- alle `import ... from '@/pages/admin/...'` regels
- `import RoleRoute`, `import SecureLayout`, `import LicenseGate`, `import { useTier } from '@/hooks/useTier'`
- `const { portal: hasPortal, admin: hasAdmin } = useTier();`
- de `{hasPortal && ...}` portal-login route **en** het hele portal-routeblok
- de `{hasAdmin && ...}` admin-login route **en** het hele admin-routeblok
- `<LicenseGate />` in de `App()`-component

Blijven staan: de publieke routes (`/`, `/approach`, `/concerns`, `/concerns/:slug`,
`/about`, `/pricing`, `/contact`) en de `*` 404-route.

---

## Tier 2 — "Studio Human — Practice"
Admin-dashboard (praktijkbeheer), géén client-portaal.

**ACTIVE_TIER = '2'**

Verwijder:
- `src/pages/portal/*` (alles)
- `src/components/SecureLayout.jsx`, `src/components/RoleRoute.jsx`, `src/components/PortalAuthLayout.jsx`
- `src/components/LicenseGate.jsx`
- `base44/functions/`: `getClientPortalData`, `clientUpdateProfile`, `clientSaveMood`, `clientSubmitAssignment`, `clientRequestAppointmentChange`, `verifyAgencyLicense`
- `base44/entities/`: `MoodEntry` (alleen portal-only)

Houdt wél: `src/pages/admin/*`, `src/components/admin/*`, alle `admin*`-functies,
en de admin-entities (`ClientProfile`, `Appointment`, `SessionNote`, `Assignment`,
`AssignmentSubmission`, `SharedDocument`, `Message`, `Invoice`, `Availability`,
`Questionnaire`, `AuditLog`).

In `src/App.jsx` verwijderen:
- alle `import ... from '@/pages/portal/...'` regels
- `import PortalLogin` (zit tussen de portal-imports)
- `import LicenseGate`
- `const { portal: hasPortal, admin: hasAdmin } = useTier();` → vervang door `const { admin: hasAdmin } = useTier();` (admin-vlag blijft nuttig)
- de `{hasPortal && ...}` portal-login route **en** het hele portal-routeblok
- `<LicenseGate />` in `App()`

Laat de admin-imports en het `{hasAdmin && ...}` blok staan.

---

## Tier 3 — "Studio Human — Full Platform"
Admin + client-portaal, alles aan, géén agency-laag.

**ACTIVE_TIER = '3'**

Verwijder alleen de agency-laag:
- `src/components/LicenseGate.jsx`
- `base44/functions/verifyAgencyLicense`

In `src/App.jsx` verwijderen:
- `import LicenseGate from '@/components/LicenseGate'`
- `<LicenseGate />` in `App()`

Alles verder blijft staan (portal + admin). Let op: `useBrand()` blijft nuttig voor
de koper om te rebranden; `AGENCY_LICENSE_SECRET` hoeft niet meer ingesteld voor tier 3.

---

## Na goedkeuring — beheer
- **Prijzen/omschrijving** wijzigen: Dashboard → Settings → App Templates → Submit Update.
- **Functie-update** (bugfix/nieuwe feature): pas aan in de master, dupliceer/snoei
  opnieuw naar de betreffende tier-app, publiceer — nieuwe kopers krijgen de laatste
  versie. Bestaande kopers updaten door zelf te re-publiceren vanuit hun kopie.
- **Uitbetaling**: volg in App Templates → My Templates; Base44 keert uit zodra
  ≥ $200 bevestigde inkomsten is bereikt (geen commissie).

## Optionele service-add-on (in overleg per klant)
Buiten de marktplaats om, na aankoop:
- Nodig de koper uit in de juiste workspace (of help bij een eigen workspace).
- Rebrand via `src/config/brand.js` (naam, tagline, contact) en evt. `src/index.css`
  + `tailwind.config.js` (kleuren/fonts) — `Logo`, `Header`, `Footer`, `Contact`
  lezen via `useBrand()`, dus één bestand volstaat voor de basis.
- Bied een onderhoudsabonnement aan (vast leggen in je eigen facturatie, niet in Base44).

## Waarom per tier een aparte app
"Create template" kopieert de **gehele** app naar de koper. De `ACTIVE_TIER`-vlag
verbergt wel routes/links, maar de koper kan de vlag zelf hoger zetten en heeft dan
alles. Echte tiers vereisen dus écht gesnoeide kopieën — vandaar dit stappenplan.