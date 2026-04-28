# eiranova-platform

**EiraNova** — Norsk hjemmehelsetjeneste-plattform for Mosseregionen/Østfold/Akershus.

*"Systemet jobber. Sykepleieren er til stede"*

---

## Status

| | |
|---|---|
| **Progress** | 18% → MVP Launch |
| **Aktiv kontrakt** | **K-REFACTOR-001** (Fase E fullfører flytt av prototype til `docs/ux-reference/`). **K-ENV-003** er **merged**. Se [CONTROL_CENTER](docs/status/CONTROL_CENTER.md). |
| **Alle kontrakter** | [docs/status/CONTROL_CENTER.md](docs/status/CONTROL_CENTER.md) |
| **Åpne funn** | [docs/contracts/DISCOVERIES.json](docs/contracts/DISCOVERIES.json) |

---

## Applikasjoner

| App | URL (prod) | URL (preview) | Port (local) |
|-----|-----------|---------------|--------------|
| Kunde-app | app.eiranova.no ¹ | eiranova-platform.vercel.app | 3001 |
| Nurse-app | nurse.eiranova.no ¹ | eiranova-nurse.vercel.app | 3002 |
| Admin-app | admin.eiranova.no ¹ | eiranova-admin.vercel.app | 3003 |
| Oppstart-app (midlertidig) | — | eiranova-oppstart.vercel.app | — (static) |

¹ Domener ikke koblet ennå — se K-ENV-001

---

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 18, TypeScript (TSX)
- **Database:** Supabase PostgreSQL — eu-central-1 Frankfurt 🇩🇪 (GDPR)
- **Auth:** Supabase Auth (e-post + passord / Google Workspace)
- **Hosting:** Vercel Pro (tre Next.js-apper + statisk marketing + midlertidig oppstart)
- **E-post:** Resend
- **Betaling:** Vipps ePayment + Stripe
- **Regnskap:** Tripletex (EHF/PEPPOL, lønn, A-melding)
- **Monorepo:** pnpm workspaces

---

## Kom i gang

```bash
# Installer avhengigheter
pnpm install

# Start dev-servere
pnpm --filter kunde-app dev   # localhost:3001
pnpm --filter nurse-app dev   # localhost:3002
pnpm --filter admin-app dev   # localhost:3003

# Governance
pnpm generate-cc  # Regenerer CONTROL_CENTER.md
pnpm queue        # Vis kontrakt-køen
```

---

## Arkitektur

Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full arkitekturbeskrivelse.

Etter **K-REFACTOR-001** er **kunde-app**, **nurse-app** og **admin-app** selvstendige Next.js App Router-apper med TypeScript. Den historiske monolitt-prototypen ligger som read-only UX-referanse under `docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx` — ikke importert fra app-kode.

---

## Governance

- **Process:** [docs/PROCESS.md](docs/PROCESS.md) — AI Dev OS v1.1
- **Kontrakt-kø:** [docs/contracts/CONTRACT_QUEUE.json](docs/contracts/CONTRACT_QUEUE.json)
- **Discoveries:** [docs/contracts/DISCOVERIES.json](docs/contracts/DISCOVERIES.json)
- **Miljøer:** [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md)
- **Hotfix:** [docs/HOTFIX-PROTOCOL.md](docs/HOTFIX-PROTOCOL.md)

---

## Kritiske åpne punkter

| Prioritet | Punkt | Ansvarlig |
|-----------|-------|-----------|
| 🔴 | EiraNova AS org.nr. — KREVES for Vipps/BankID/Tripletex | Lise |
| 🔴 | HPR-verifisering alle sykepleiere | Lise + Richard |
| 🔴 | Journalansvarlig utpekes FØR første stell | Lise |
| 🔴 | Statsforvalteren registrering | Lise |
| 🔴 | MVA-avklaring: Besøksvenn + Trilleturer (mva_risiko 'høy') | Revisor |
| 🟡 | Domener koblet i Vercel (K-ENV-001) | Richard |
| 🟡 | NHN-sertifisering (FØR K-JOURNAL-001) | Richard |
| 🟡 | Skattetrekkskonto DNB | Lise |

---

*EiraNova AS / X Group AS — Powered by CoreX*
