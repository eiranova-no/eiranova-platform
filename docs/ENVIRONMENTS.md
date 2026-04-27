# Miljøer & Infrastruktur — EiraNova

---

## Tredelt deployment-modell (K-ENV-003)

| Lag | Git-branch | Vercel-rolle | Supabase | Typisk URL | EnvBadge |
|-----|------------|--------------|----------|------------|----------|
| **Production** | `main` | Production | **prod** (eiranova-prod) | Egne domener under § URL-er | Ingen |
| **Staging** | `dev` | Preview (alias på `staging.*`) | **dev** (eiranova-dev) | `staging.*.eiranova.no` | Grå / preview-styling: `ENV: Preview \| DATA: Supabase-Dev` |
| **Feature / PR** | `feature/*` | Preview | **dev** | `*.vercel.app` per deploy | Samme som staging: `ENV: Preview \| DATA: Supabase-Dev` |
| **Local** | — | — | **dev** | `localhost:3001` / `3002` / `3003` | Blå: `ENV: Local \| DATA: Supabase-Dev` |

**Mental modell:** `main` = sluttbrukere på `app` / `nurse` / `admin`. `dev` = QA på `staging.*`. Pull requests = isolerte preview-URL-er. Lokalt = alltid dev-Supabase med tydelig «Local»-merke.

---

## URL-er (alle tre plattform-apper)

### Production (`main`, prod-Supabase, ingen badge)

| App | Domene |
|-----|--------|
| Kunde | https://app.eiranova.no |
| Sykepleier | https://nurse.eiranova.no |
| Admin | https://admin.eiranova.no |

### Staging (`dev`, dev-Supabase, preview-badge)

| App | Domene |
|-----|--------|
| Kunde | https://staging.app.eiranova.no |
| Sykepleier | https://staging.nurse.eiranova.no |
| Admin | https://staging.admin.eiranova.no |

SSL utstedes av Vercel for alle seks domenene over. Verifiser i nettleser ved endringer (propagering kan ta noen minutter).

### Feature / PR-preview

Auto-genererte Vercel-URL-er per prosjekt og PR, f.eks. `https://eiranova-web-….vercel.app`, `https://eiranova-nurse-….vercel.app`, `https://eiranova-admin-….vercel.app`. Samme Preview-env-vars som staging (dev-Supabase).

### Lokalt

| App | Port |
|-----|------|
| Kunde-app | http://localhost:3001 |
| Nurse-app | http://localhost:3002 |
| Admin-app | http://localhost:3003 |

---

## Supabase

| Prosjekt | Ref | Region | Brukes av |
|----------|-----|--------|-----------|
| eiranova-prod | (se `.env` / Vercel Production) | eu-central-1 Frankfurt 🇩🇪 | Production-domener |
| eiranova-dev | (se `.env` / Vercel Preview) | eu-central-1 Frankfurt 🇩🇪 | Staging, PR-preview, localhost |

**Frankfurt er non-negotiable** — GDPR-krav for helsedata.

---

## Vercel-prosjekter

| Prosjekt | Root Directory | Production-domene | Staging-domene |
|----------|----------------|-------------------|----------------|
| eiranova-web | `apps/kunde-app` | app.eiranova.no | staging.app.eiranova.no |
| eiranova-nurse | `apps/nurse-app` | nurse.eiranova.no | staging.nurse.eiranova.no |
| eiranova-admin | `apps/admin-app` | admin.eiranova.no | staging.admin.eiranova.no |

**Production Branch** for alle tre: `main` (etter K-ENV-003). `dev` deployes som Preview og kobles til `staging.*` via domene-alias i Vercel.

`oppstart` og `marketing` er egne, midlertidige Vercel-prosjekter — ikke en del av tabellen over.

---

## Environment Variables

Alle tre plattform-prosjektene trenger konsistente variabler per Vercel-miljø (**Production** vs **Preview**):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Miljø-identifikasjon (sammen med EnvBadge)
# production → ingen badge; preview → "Preview"; development (local) → "Local"
NEXT_PUBLIC_APP_ENV=production   # production | preview | development
# prod → production databasen; dev → eiranova-dev
NEXT_PUBLIC_DATA_SOURCE=prod     # prod | dev

# Resend
RESEND_API_KEY=

# (kun production / når aktivert)
VIPPS_CLIENT_ID=
VIPPS_CLIENT_SECRET=
VIPPS_MERCHANT_SERIAL_NUMBER=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

TRIPLETEX_TOKEN=
TRIPLETEX_EMPLOYEE_ID=
TRIPLETEX_COMPANY_ID=
```

**Sjekkliste:** Production-env skal peke til **prod**-Supabase og `NEXT_PUBLIC_APP_ENV=production` / `NEXT_PUBLIC_DATA_SOURCE=prod`. Preview (staging + PR) skal peke til **dev**-Supabase og typisk `NEXT_PUBLIC_APP_ENV=preview` / `NEXT_PUBLIC_DATA_SOURCE=dev`. Lokalt: `development` + `dev`.

---

## Miljø-badge (EnvBadge)

Tre tydelige tilstander (verifisert etter K-ENV-003):

1. **Produksjon** — ingen badge (`NEXT_PUBLIC_APP_ENV === production`).
2. **Staging og feature/preview** — synlig **grå/preview**-stil; tekst **`ENV: Preview | DATA: Supabase-Dev`** (Vercel Preview).
3. **Localhost** — **blå** tydelighet for `development`; tekst **`ENV: Local | DATA: Supabase-Dev`**.

```
Produksjon:     (ingen stripe)
Preview:        ENV: Preview | DATA: Supabase-Dev
Local:          ENV: Local | DATA: Supabase-Dev   (blå visuell profil)
```

Komponent: `EnvBadge` i hver app (`components/EnvBadge.tsx`), brukt fra layout der det er påkrevd.

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

## Implementeringsstatus (oppdatert etter K-ENV-003)

| Komponent | Status | Notat |
|-----------|--------|--------|
| Production-domener + SSL | ✅ | app / nurse / admin på `main`, prod-Supabase, ingen badge |
| Staging-domener + SSL | ✅ | staging.app / nurse / admin på `dev`, dev-Supabase, preview-badge |
| PR-preview | ✅ | Auto-URL, dev-Supabase |
| Preview env-vars (alle tre apper) | ✅ | dev-Supabase i Vercel Preview |
| Production env-vars (alle tre apper) | ✅ | prod-Supabase (K-DB-002 + Vercel Production) |
| dev-Supabase schema | ✅ | K-DB-001 / migrasjoner |
| prod-Supabase schema | ✅ | K-DB-002 |
| Vercel Production Branch | ✅ | `main` for eiranova-web / nurse / admin |
| Branch protection `dev` | ✅ | PR + status checks |
| Branch protection `main` | ⏸ | Egen oppfølging (jf. K-LAUNCH-001 / governance) |

---

*EiraNova — AI Dev OS v1.1 · X Group AS / CoreX*
