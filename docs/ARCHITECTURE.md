# Arkitektur — EiraNova

---

## Overordnet

EiraNova er en norsk hjemmehelsetjeneste-plattform for Mosseregionen/Østfold/Akershus.

**Visjon:** *"Systemet jobber. Sykepleieren er til stede"*

---

## Monorepo-struktur

```
eiranova-platform/
├── apps/
│   ├── kunde-app/          → app.eiranova.no (Next.js 15 App Router, TypeScript)
│   ├── nurse-app/          → nurse.eiranova.no (Next.js 15 App Router, TypeScript)
│   ├── admin-app/          → admin.eiranova.no (Next.js 15 App Router, TypeScript)
│   ├── marketing/          → eiranova.no (statisk HTML)
│   └── oppstart/           → intern oppstart-side
├── packages/
│   ├── ui/                 ← @eiranova/ui (tokens, helpers, felles komponenter, hooks)
│   └── mock-data/          ← @eiranova/mock-data (genererte fixtures, types)
├── docs/
│   ├── ux-reference/
│   │   └── EiraNova-Prototype-v17-REFERENCE.jsx  ← read-only historisk artefakt
│   ├── contracts/
│   │   ├── CONTRACT_QUEUE.json   ← Governance OS
│   │   ├── DISCOVERIES.json      ← Append-only discovery log
│   │   └── active/               ← Aktive kontrakt-specs
│   ├── status/
│   │   ├── CONTROL_CENTER.md     ← Auto-generert fra CONTRACT_QUEUE
│   │   └── MERGED_HISTORY.md     ← Komplett merge-historikk
│   ├── PROCESS.md
│   ├── ARCHITECTURE.md (denne)
│   ├── ENVIRONMENTS.md
│   ├── CHANGELOG.md
│   └── HOTFIX-PROTOCOL.md
├── supabase/
│   └── migrations/
├── scripts/
│   ├── generate-control-center.ts
│   └── queue.ts
├── .cursorrules
├── .github/workflows/ci.yml
├── package.json
└── pnpm-workspace.yaml
```

---

## App Router-arkitektur

Etter K-REFACTOR-001 (april 2026) er hver app en selvstendig Next.js
App Router-applikasjon med egne typede komponenter:

```
kunde-app/                    nurse-app/                  admin-app/
├── app/                      ├── app/                    ├── app/
│   ├── login/                │   ├── login/              │   ├── dashboard/
│   ├── hjem/                 │   ├── hjem/               │   ├── oppdrag/
│   ├── bestill/              │   ├── oppdrag/            │   ├── betalinger/
│   ├── b2b/                  │   ├── innsjekk/           │   ├── ansatte/
│   └── ...                   │   └── ...                 │   └── ...
└── components/               └── components/             └── components/
    └── screens/                  └── screens/                └── screens/
```

Felles UI-tokens, helpers og komponenter ligger i `packages/ui` (`@eiranova/ui`).
Mock-data og typer ligger i `packages/mock-data` (`@eiranova/mock-data`).
Originalprototypen er bevart som read-only artefakt under `docs/ux-reference/`.

## Cross-app navigasjon

B2B-skjermer (koordinator-flyt) ligger i `kunde-app` under `/b2b/*`-ruter.
Nurse-skjermer i `nurse-app`. Admin-skjermer i `admin-app`. Apper kommuniserer
via separate domener — ikke via delt state. Cross-app-flows (f.eks. nurse
profilendring → admin godkjenningskø) går via Supabase som koordineringspunkt.

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 15 App Router, React 18, TypeScript (TSX) |
| Monorepo | pnpm workspaces |
| Backend | Supabase (Auth + Postgres + Realtime + Edge Functions) |
| Hosting | Vercel Pro (tre separate prosjekter) |
| Database | PostgreSQL via Supabase, eu-central-1 Frankfurt |
| E-post | Resend |
| Betaling | Vipps ePayment + Stripe |
| Regnskap | Tripletex (EHF/PEPPOL, lønn, A-melding) |
| Push-varsler | Web Push (VAPID) + Supabase Edge Functions |

---

## Auth-arkitektur

```
Privat kunde:       e-post + passord (Supabase Auth)
                    INGEN Magic Link. INGEN Google OAuth.

Sykepleier:         Google Workspace @eiranova.no (OAuth)
                    hd-parameter begrenser til @eiranova.no

B2B koordinator:    Google Workspace / e-post + invitasjon
B2B bruker:         e-post + passord + aktivering av koordinator

Admin:              Sykepleier-innlogging → koordinator-rolle
```

---

## Modul-toggles

Tre globale toggles i `innstillinger`-tabellen (singleton):

```
b2b_aktiv         false   Skjuler/viser hele B2B-domenet
journal_aktiv     false   Skjuler/viser journalknapp
journal_modus     ekstern 'ekstern' → redirect | 'intern' → K-JOURNAL-001
```

---

## Database-regler

- **Supabase eu-central-1 Frankfurt** — non-negotiable, GDPR helsedata
- **RLS** på alle tabeller uten unntak
- **Soft-delete** på users (aldri hard-slett persondata)
- **samtykker** — ingen DELETE policy (GDPR append-only)
- **oppdrag_endringer** — append-only audit-log
- **journal_tilganger** — append-only lovpålagt audit-log

---

## Domene-struktur

```
eiranova.no          → Marketing (statisk HTML)
app.eiranova.no      → Kunde-app (Next.js)
nurse.eiranova.no    → Nurse-app (Next.js)
admin.eiranova.no    → Admin-app (Next.js)
```

DNS via Domeneshop. Sertifikater via Vercel (automatisk).

---

*EiraNova — Faglig trygghet. Menneskelig nærhet.*
*AI Dev OS v1.1 · X Group AS / CoreX*
