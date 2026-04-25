# Changelog — EiraNova

Alle merkbare endringer dokumenteres her.
Format basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- **K-AUTH-001 (kunde-app):** Supabase Auth med `@supabase/ssr` (browser- og server-klient, `middleware` med `PROTECTED_PATHS` og `?gate=`), `AuthProvider` + `useAuth`, genererte `database.types.ts`, ruter for login/onboarding (push, samtykke), glemt/reset passord, og `KundePrototypeShell` som kobler URL ↔ prototype-skjerm. Resend/SMTP og norske auth-maller konfigureres i dashboard (se `docs/contracts/active/K-AUTH-001.md` T-001). Oppdagelser: D-008 (fjernet Google-knapp privatkunde, resolved), D-009 (pårørende `relasjon` utsatt til K-PROFIL-001, open).
- **K-DB-001:** Supabase-migrasjoner under `supabase/migrations/` (001 core, 002 betaling/B2B, 003 personal, 004 config/GDPR, 005 RLS inkl. `handle_new_user` på `auth.users`, 006 seed), `supabase/config.toml` fra `supabase init`, og `docs/DATA_MODEL.md` med oversikt over tabellgrupper, enums og RLS-mønstre. Oppdaget avvik (D-007) i `DISCOVERIES.json` — løst i denne koden.

### Changed
- apps/oppstart/ oppgradert fra localStorage til Supabase realtime sync.
  Nytt Supabase-prosjekt eiranova-oppstart (eu-central-1), separate tabeller
  for tasks/completions/comments. Tre-brukerlogg (Lise/Therese/Jeanett) med
  completed_by og comments per oppgave. RLS på med åpen anon-policy —
  sikkerheten ligger i delt passord + deling av anon-nøkkel.
- Domener koblet i Vercel: app/nurse/admin.eiranova.no
- EnvBadge-komponent i prototype (vises i preview/local, ikke production)
- .env.example opprettet for alle tre apper

### Added
- CONTRACT_QUEUE.json med alle 31 kontrakter (Fase 0–5)
- DISCOVERIES.json med åpne tekniske og juridiske punkter
- CONTROL_CENTER.md auto-generert fra CONTRACT_QUEUE
- PROCESS.md — AI Dev OS v1.1 for EiraNova
- ENVIRONMENTS.md — miljø-oversikt og env-var-dokumentasjon
- HOTFIX-PROTOCOL.md
- apps/oppstart/ — intern statisk app for oppstartsplan og compliance-sjekkliste
  (passordbeskyttet, Supabase realtime-sync, add/edit/delete av egne oppgaver).
  Midlertidig: eget Vercel-prosjekt (samme mønster som marketing), root apps/oppstart/, ingen custom domain.

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
