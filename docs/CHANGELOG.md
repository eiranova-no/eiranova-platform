# Changelog — EiraNova

Alle merkbare endringer dokumenteres her.
Format basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- CONTRACT_QUEUE.json med alle 31 kontrakter (Fase 0–5)
- DISCOVERIES.json med åpne tekniske og juridiske punkter
- CONTROL_CENTER.md auto-generert fra CONTRACT_QUEUE
- PROCESS.md — AI Dev OS v1.1 for EiraNova
- ENVIRONMENTS.md — miljø-oversikt og env-var-dokumentasjon
- HOTFIX-PROTOCOL.md

---

## [0.1.0] — 2026-04-08

### Added
- EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx (7826+ linjer)
- Alle tre Next.js-apper (kunde-app, nurse-app, admin-app) importerer prototypen
- apps/marketing/ — enkel landing page
- .cursorrules v5.0 med EiraNova-spesifikke regler
- docs/CURSOR-INSTRUKSJON.md med komplett kontrakt-spesifikasjoner
- Supabase-oppsett: eiranova-dev + eiranova-prod (eu-central-1 Frankfurt)
- Vercel-oppsett: eiranova-web, eiranova-nurse, eiranova-admin (alle grønne)
- Resend konfigurert for eiranova.no
- Google Workspace post@eiranova.no

### UX (prototype v17)
- Onboarding alle 4 brukertyper (kunde, sykepleier, B2B koordinator, B2B bruker)
- NurseLogin med Google Workspace primær og e-post/passord reserve
- Glemt passord validerer kun @eiranova.no (nurseMode)
- Modal-fix med ReactDOM.createPortal
- Responsivt design: 375/768/1280px
- useLayoutEffect → useEffect fix (SSR)
- Tjenestebeskrivelser med INIT_TJENESTER_CATALOG
- Avbestillingssystem med 48-timers regel
- B2B kontaktskjema og admin-panel
- Nurse-profil med godkjenningskø

---

*EiraNova — Faglig trygghet. Menneskelig nærhet.*
