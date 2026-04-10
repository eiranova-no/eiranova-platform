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
│   ├── prototype/
│   │   └── EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx  ← ENESTE KILDEFIL (nå)
│   ├── kunde-app/          → app.eiranova.no
│   │   └── app/page.jsx    ← importerer prototype med forcedTab="kunde"
│   ├── nurse-app/          → nurse.eiranova.no
│   │   └── app/page.jsx    ← importerer prototype med forcedTab="nurse"
│   ├── admin-app/          → admin.eiranova.no
│   │   └── app/page.jsx    ← importerer prototype med forcedTab="admin"
│   └── marketing/          → eiranova.no (statisk HTML)
├── docs/
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

## Prototype-arkitektur

**Én kildefil styrer tre apper:**

```
EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx
         ↓              ↓              ↓
    kunde-app       nurse-app       admin-app
   (forcedTab=      (forcedTab=     (forcedTab=
    "kunde")         "nurse")        "admin")
```

Alle UX-endringer skjer i prototypen. Ingen separate komponent-filer ennå.
K-ROUTE-001 og videre vil splitte prototypen til ekte Next.js App Router-struktur.

---

## Delt state i prototype

```
App()
├── tjenesterCatalog    ← admin ↔ kunde (live sync)
├── nursesCatalog       ← admin ↔ kunde ↔ bestilling
├── mockOrders          ← kunde ↔ admin
└── ventendeProfilendringer ← nurse → admin godkjenningskø
```

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 15, React, JSX (→ TSX ved K-ROUTE-001) |
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
