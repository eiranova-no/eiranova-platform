# Changelog — EiraNova

Alle merkbare endringer dokumenteres her.
Format basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### K-REFACTOR-001 Fase E — slett prototype, fullfør refactor

- Flyttet `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx`
  til `docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx` som read-only artefakt
- Slettet `apps/prototype/`-mappa
- Oppdatert `scripts/extract-prototype-mock-data.mjs` til ny path
- Oppdatert `.cursorrules` og `.cursor/rules/richard-prototype-workflow.mdc`
- Oppdatert `docs/ARCHITECTURE.md` med ny monorepo-struktur og App Router-arkitektur
- Oppdatert `README.md` (status, arkitektur-stripe, tech stack)
- Markert D-001 som resolved (referanse: K-REFACTOR-001)
- D-036: LoginBedrift — «Gå til kontaktskjema», B2B-bruker «Logg inn» og «Les hva du gjør» koblet til navigasjon / Auth

K-REFACTOR-001 er ferdig implementert. Queue-oppdatering (kontrakten → merged,
K-ROUTE-001 → ready, K-AUTH-002 blocked_reason oppdatert) kommer i separat
`chore/queue-update-*` PR.

### Fix-up etter K-REFACTOR-001 Fase D6 — B2B-navigasjon fra Login

- "Logg inn med Google Workspace" → /b2b/dashboard (var tom onClick; faktisk Google-auth i K-AUTH-002)
- "Logg inn som koordinator" → /b2b/dashboard (var tom onClick)
- "Aktiver konto med invitasjon →" → /b2b/bruker-aktivering (var tom onClick)
- "Ikke mottatt invitasjon?" → /b2b/ingen-invitasjon (onNavKunde manglet håndtering)
- Bug introdusert i Fase B (Login-migrering) men avdekket først ved D6 staging-verifisering, da B2B-rutene faktisk fantes som mål

### K-REFACTOR-001 Fase D6 — kunde-app: B2B-koordinator-skjermer

- B2BDashboard → /b2b/dashboard (koordinator-oversikt, brukerliste)
- B2BBestill → /b2b/bestill (legg til ny B2B-bruker)
- B2BBruker → /b2b/bruker?id= (detaljvisning av B2B-bruker, ukeplan)
- B2BOnboarding → /b2b/onboarding (intro-flyt for nye koordinatorer)
- B2BBrukerAktivering → /b2b/bruker-aktivering (aktivering av enkeltbruker)
- IngenInvitasjonInfo → /b2b/ingen-invitasjon (info for ikke-inviterte)
- B2BLogin (linje 6136–6142 i prototypen) ikke migrert — allerede deaktivert i prototypen (redirect til /login)
- LoginGate (linje 9240–9265) ikke migrert — auth-gate dekkes av K-AUTH-002 middleware

Med D6 er alle skjermer fra prototypen migrert. Kun Fase E (slett apps/prototype/) gjenstår av K-REFACTOR-001.

### K-REFACTOR-001 Fase D5 — admin-app: Økonomi + Innstillinger

- OkonomiPage → /okonomi (3 hovedfaner: regnskap/lønn/kalkulator; MVA under regnskap)
- LonnPanel migrert som Okonomi-lokal helper (interne faner som i prototypen)
- PrisKalkulator migrert som Okonomi-lokal helper
- InnstillingerPage → /innstillinger (varsel-mottakere, dekningsområder, B2B-toggle, journalmodul, integrasjoner, B2B-faktura, purring/inkasso, kanselleringsregler, API-nøkler)
- Alle 8 admin-sider er nå migrert. D6 (B2B-skjermer) og Fase E (slett prototype) gjenstår.

### K-REFACTOR-001 Fase D4 — admin-app: B2B + Tjenester

- AB2B → /b2b (3 tabs: kunder/fakturaer/avtalemodeller, MOCK_B2B_HENVENDELSER-kort, drawer-trigger via Context)
- «Opprett koordinator»-knapp navigerer til `/ansatte?prefillEmail=<email>` (oppfølging av D3-kontrakten)
- TjenesteAdmin → /tjenester (kategori-grid, tjeneste-modal, kalkulator, instruks-editor)
- InstruktionEditor + TjenesteKalkulator migrert som lokale helpers under `screens/Tjenester/`
- `tjenesterCatalog` er lokal state — Supabase-persistens kommer i K-TJENESTE-001

### K-REFACTOR-001 Fase D3 — admin-app: Betalinger + Ansatte

- ABetalinger → /betalinger (5 tabs: oversikt/vipps/stripe/krediteringer/aktivitet)
- AAnsatte → /ansatte (4 tabs: interne/vikarer/b2b/roller, prefillEmail via query-param)
- KreditnotaB2BModal migrert som delt komponent
- VikarPanel migrert som `components/screens/Ansatte/VikarPanel.tsx` (innebygd i vikarer-fanen; D-035)
- D-034 registrert: Cross-app profilendrings-flyt brutt — adresseres i K-NURSE-001 / tilsvarende admin-binding
- D-035 registrert: VikarPanel i D3 + sendInvite/invitasjonsPending vs mock-data
- AB2B (D4) skal navigere til `/ansatte?prefillEmail=<email>` (encodeURIComponent) for koordinator-opprettelse

### K-REFACTOR-001 Fase D2 — admin-app: Dashboard + Oppdrag

- ADashboard → /dashboard (KPI-grid, oppdrag-i-dag-kort, sykepleiere-nå-kort, inntekt-graf)
- AOppdrag → /oppdrag (filter-tabs, tabell, OppdragModal, KrediterPrivatModal)
- AdminDrawerContext for drawer-state på tvers av sider
- Bdg + useAdminToast som lokale kopier (D-031 registrert for senere uttrekk til @eiranova/ui)
- D-032 resolved (cyrillisk «а» i OppdrагModal i prototypen — migrert til korrekt latinsk navn)

### K-REFACTOR-001 Fase D1 — admin-app infrastruktur

- App Router root layout (`apps/admin-app/app/layout.tsx`) + (admin) shell-layout med ASidebar/AHeader/ADrawer
- ANAV migrert til `apps/admin-app/lib/admin/adminNav.ts` (ADMIN_NAV_ITEMS + path-helpers)
- Mock useAuth-stub (parallelt med nurse-app C1)
- 8 placeholder-sider for admin-nav-items (sider migreres i D2–D5)
- admin-app importerer ikke lenger fra `apps/prototype/`

### K-REFACTOR-001 Fase C2 — nurse-app skjerm-migrering (Innsjekk + Rapport)

- Migrert NurseInnsjekk → `/innsjekk?id=<oppdragId>` med pixel-parity (`apps/nurse-app/components/screens/Innsjekk/`)
- Migrert NurseRapport → `/rapport` (deep-link, ingen BottomNav, pixel-parity) (`apps/nurse-app/components/screens/Rapport/`)
- D-029 registrert (mock-auth bypass — funn fra C1 staging-verifisering)
- Lærdom fra C1 anvendt: stage og commit per steg, pixel-parity over kodestil

### Changed
- **K-REFACTOR-001 (nurse-app, Fase C1 — kjerne):** Migrert seks nurse-skjermer + delt navigasjon fra prototype-import til App Router under `apps/nurse-app/` (`.tsx`). Ruter: `/login`, `/rolle`, `/onboarding`, `/`, `/oppdrag`, `/profil`; `NurseBottomNav` inne i `.phone fu`; mock `useAuth`-stub (`lib/auth/useAuth.ts`); `@eiranova/ui` + `@eiranova/mock-data` via `transpilePackages`; `layout.tsx` med global CSS. Ingen import fra `apps/prototype/` i nurse-app. Innsjekk/Rapport → Fase C2. Oppdagelser: D-026 (env/Supabase), D-027 (glemt-passord flyt); D-028 (cross-app URL vs `router`). Toast `fadeInUp` lagt til i `packages/ui` for pixel-paritet.
- K-ENV-003 markert som merged i kø. K-REFACTOR-001 satt tilbake til active.
- K-ENV-003 fullført: tredelt deployment-modell etablert. main → production-domener (app.eiranova.no, nurse.eiranova.no, admin.eiranova.no), dev → staging-domener (staging.app.eiranova.no, staging.nurse.eiranova.no, staging.admin.eiranova.no), feature/* → preview. Vercel Production Branch endret fra dev til main for alle tre apper.
- **Kø (`chore/queue-update-K-ENV-003`):** K-ENV-003 lagt til som **active** (tredelt deployment: `main` + prod-Supabase, `dev` + staging.* + dev-Supabase, `feature/*` previews). K-REFACTOR-001 satt **paused** med `paused_reason` under K-ENV-003. Status `paused` i `CONTRACT_QUEUE.json` `status_taxonomy`; `pnpm generate-cc` / `pnpm queue` støtter pausede kontrakter. Spec: `docs/contracts/active/K-ENV-003.md`.
- **K-REFACTOR-001 (kunde-app, Fase B2, fullført):** Bestill-flyt i App Router (`app/bestill/*`, `BestillFlowContext` med `sessionStorage`-backup), Betaling, Bekreftelse, `?tjeneste=`-prefill (D-019). Fjernet `KundePrototypeShell` og `app/prototype-styles.tsx` (Steg 5). Oppdagelser D-019/D-021/D-023–D-025 avklart i `DISCOVERIES.json`. Flyt verifisert: Hjem → Bestill → Betaling → Bekreftelse → Mine.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 10, siste i B1):** `OppdragIGang` og `ChatKunde` i `components/screens/OppdragIGang/OppdragIGang.tsx` og `components/screens/ChatKunde/ChatKunde.tsx`; `app/oppdrag-i-gang/page.tsx` og `app/chat/page.tsx` rendrer de migrerte skjermene med `getServerSession` / `redirect` til `/login?returUrl=...` (samme mønster som profil). `ProfilHeader` får valgfri `slim` (prototype PH slim). `useLandingToast` for mock-anrop på oppdag-skjermen. Én commit for begge skjermer.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 9):** `KundeProfil` i `components/screens/KundeProfil/KundeProfil.tsx`; `app/profil/page.tsx` bruker `getServerSession` og `redirect` til `/login?returUrl=%2Fprofil` uten sesjon. `Login` håndterer `returUrl` (i tillegg til `gate`) etter vellykket innlogging når bruker har adresse. `useLandingToast`, `BN_K`, utloggingsflyt.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 8):** `lib/auth/server.ts` med `getServerSession()` (Supabase server-klient fra `lib/supabase/server.ts`). `/` (RSC): uten sesjon → `Landing`, med sesjon → `Hjem` (`components/screens/Hjem/Hjem.tsx`, mock `DEFAULT_KUNDE_SERVICES` / `ORDERS`, `mockKundeNesteAvtale`, `BN_K`). Innlimt lettvekts BNav/DeskNav/Bdg/modal til paritet med prototype. Oppdagelse D-020 (getSession vs getUser på server).
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 7):** Flerstegs `Onboarding` i `components/screens/Onboarding/Onboarding.tsx` (intern `useState` for steg). Navigasjon ut: `onExitToHome` → `router.push("/")` (Hopp over / fallback), `onFerdig` → `router.push("/")`. Ingen prototype-import på `/onboarding`.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 6):** `PushTillatelse` i `components/screens/PushTillatelse/PushTillatelse.tsx`; `onboarding/push` bruker migrert `PushTillatelse` (ikke prototype-import). `kundeOnValg` / `onNav` som før.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 5):** `Samtykke` i `components/screens/Samtykke/Samtykke.tsx`; `onboarding/samtykke` bruker migrert `Samtykke` (lokal `PH`-subset for Les-skjermer, ikke prototype-import). `onNav("epost-bekreftelse")` ruter til `/epost-bekreftelse`.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 4):** `EpostBekreftelse` i `components/screens/EpostBekreftelse/EpostBekreftelse.tsx`; rute `/epost-bekreftelse` med `searchParams.epost` som `regEpost`. «Send på nytt» kaller `supabase.auth.resend` (signup) med samme `emailRedirectTo` som i `signUp`.
- **K-REFACTOR-001 (kunde-app, Fase B1 Steg 3):** `GlemtPassord` flyttet fra prototype til `components/screens/GlemtPassord/GlemtPassord.tsx`; `/glemt-passord` bruker `useAuth().resetPassword` (Supabase `resetPasswordForEmail` med `redirectTo` til `/reset-passord`). Ingen `nurseMode` i kunde-app.
- **Kø (`chore/queue-update-K-REFACTOR-001`):** K-DB-002 merget (`merged_at` 2026-04-26). K-REFACTOR-001 opprettet og satt **active** (avvikle prototype-som-master). K-ROUTE-001 revidert til Next.js middleware (status **blocked** inntil refactor). K-AUTH-002 satt **blocked** på K-REFACTOR-001 + K-ROUTE-001. D-001 i `DISCOVERIES.json` oppdatert (triaged, peker på K-REFACTOR-001). `schema_notes` for valgfri `blocked_reason` i `CONTRACT_QUEUE.json`. `pnpm generate-cc` regenererte `CONTROL_CENTER.md` og `MERGED_HISTORY.md`.

### Fixed
- **Prototype:** Fjernet duplikat `EnvBadge` fra `EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` (SSR-gren returnerte alltid `development`/`dev`). Kunde-, sykepleier- og admin-apper bruker kun `EnvBadge` fra layout (`lib/env`); prod skjules når `NEXT_PUBLIC_APP_ENV === production` (fiks for feil merke på nurse/admin.eiranova.no).

### Added
- **K-AUTH-001 (kunde-app):** Supabase Auth med `@supabase/ssr` (browser- og server-klient, `middleware` med `PROTECTED_PATHS` og `?gate=`), `AuthProvider` + `useAuth`, genererte `database.types.ts`, ruter for login/onboarding (push, samtykke), glemt/reset passord, og `KundePrototypeShell` som kobler URL ↔ prototype-skjerm. Resend/SMTP og norske auth-maller konfigureres i dashboard (se `docs/contracts/active/K-AUTH-001.md` T-001). Oppdagelser: D-008 (fjernet Google-knapp privatkunde, resolved), D-009 (pårørende `relasjon` utsatt til K-PROFIL-001, open).
- **K-DB-001:** Supabase-migrasjoner under `supabase/migrations/` (001 core, 002 betaling/B2B, 003 personal, 004 config/GDPR, 005 RLS inkl. `handle_new_user` på `auth.users`, 006 seed), `supabase/config.toml` fra `supabase init`, og `docs/DATA_MODEL.md` med oversikt over tabellgrupper, enums og RLS-mønstre. Oppdaget avvik (D-007) i `DISCOVERIES.json` — løst i denne koden.

### Changed
- `docs/contracts/CONTRACT_QUEUE.json`: K-AUTH-002 satt `ready` (etter merge av K-AUTH-001); `pnpm generate-cc` regenererte `CONTROL_CENTER.md` og `MERGED_HISTORY.md`.
- `docs/contracts/CONTRACT_QUEUE.json`: K-AUTH-001 markert `merged` (`merged_at` 2026-04-25); `pnpm generate-cc` regenererte `CONTROL_CENTER.md` og `MERGED_HISTORY.md`.
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
