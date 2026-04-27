# Miljøer & Infrastruktur — EiraNova

---

## Oversikt

| Miljø | Branch | Vercel URL | Supabase | Badge |
|-------|--------|------------|----------|-------|
| **Production** | `main` | app.eiranova.no | eiranova-prod | Ingen |
| **Preview** | `dev` | eiranova-platform.vercel.app | eiranova-dev | `ENV: Preview \| DATA: Supabase-Dev` |
| **Feature** | `feature/*` | Per-PR URL | eiranova-dev | `ENV: Feature \| DATA: Supabase-Dev` |
| **Local** | — | localhost:3001/3002/3003 | eiranova-dev | `ENV: Local \| DATA: Supabase-Dev` |

---

## Supabase

| Prosjekt | Ref | Region | Brukes av |
|----------|-----|--------|-----------|
| eiranova-prod | (se .env) | eu-central-1 Frankfurt 🇩🇪 | Production |
| eiranova-dev | (se .env) | eu-central-1 Frankfurt 🇩🇪 | Preview + Feature + Local |

**Frankfurt er non-negotiable** — GDPR-krav for helsedata.

---

## Vercel-prosjekter

| Prosjekt | Root Directory | Domene (prod) |
|----------|---------------|---------------|
| eiranova-web | `apps/kunde-app` | app.eiranova.no |
| eiranova-nurse | `apps/nurse-app` | nurse.eiranova.no |
| eiranova-admin | `apps/admin-app` | admin.eiranova.no |

---

## Environment Variables

Alle tre Vercel-prosjekter trenger:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Miljø-identifikasjon
NEXT_PUBLIC_APP_ENV=production   # production | preview | development
NEXT_PUBLIC_DATA_SOURCE=prod     # prod | dev

# Resend
RESEND_API_KEY=

# (kun production)
VIPPS_CLIENT_ID=
VIPPS_CLIENT_SECRET=
VIPPS_MERCHANT_SERIAL_NUMBER=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

TRIPLETEX_TOKEN=
TRIPLETEX_EMPLOYEE_ID=
TRIPLETEX_COMPANY_ID=
```

---

## Miljø-badge

EnvBadge-komponent vises i prototype når `NEXT_PUBLIC_APP_ENV !== 'production'`:

```
┌─────────────────────────────────┐
│ ENV: Preview | DATA: Supabase-Dev│
└─────────────────────────────────┘
```

---

## Lokalt oppsett

```bash
# Start alle tre apper
pnpm --filter kunde-app dev    # localhost:3001
pnpm --filter nurse-app dev    # localhost:3002
pnpm --filter admin-app dev    # localhost:3003

# Drep port og restart
lsof -ti :3001 | xargs kill -9
rm -rf apps/kunde-app/.next
pnpm --filter kunde-app dev
```

---

## CI (GitHub Actions)

`.github/workflows/ci.yml` kjøres på alle PR og push til `dev`/`main`:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [kunde-app, nurse-app, admin-app]
    steps:
      - pnpm install
      - pnpm --filter ${{ matrix.app }} build
```

---

## Implementeringsstatus per 2026-04-26

| Komponent | Status | Notat |
|---|---|---|
| Preview env-vars (alle tre apper) | ✅ Aktivert | dev-Supabase, satt i K-ENV-002 |
| Production env-vars (alle tre apper) | 🟡 K-DB-002 | Aktiveres mot prod-Supabase |
| dev-Supabase schema | ✅ Migrert | K-DB-001, 26 tabeller |
| prod-Supabase schema | 🟡 K-DB-002 | Tomt per i dag, migreres |
| Branch protection dev | ✅ Aktiv | dev-protection ruleset |
| Branch protection main | ⏸ K-LAUNCH-001 | Settes ved produksjons-cut-over |
| Production Branch | `dev` | Endres til `main` i K-LAUNCH-001 |

---

*EiraNova — AI Dev OS v1.1 · X Group AS / CoreX*
