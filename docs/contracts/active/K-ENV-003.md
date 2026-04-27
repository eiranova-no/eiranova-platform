# K-ENV-003 — Etabler tredelt deployment-modell

| Felt | Verdi |
| --- | --- |
| **ID** | K-ENV-003 |
| **Tittel** | Etabler tredelt deployment-modell — main = production, dev = staging, feature/* = preview |
| **Type** | infra |
| **Status** | active |
| **Eier** | Richard (technical architect) |
| **Implementor** | Cursor (kode/dokumentasjon) + Richard (Vercel/DNS — manuelt i nettleser) |
| **Avhengigheter** | K-INFRA-001, K-ENV-001, K-ENV-002, K-DB-002 (alle merget) |
| **Estimat** | 2–3 timer arbeid + 30 min DNS-propagering |

---

## Mål

Etabler en **klart adskilt tredelt deployment-modell** for de tre kunde-app, nurse-app og admin-app:

| Subdomain | Git-branch | Vercel-rolle | Supabase | Bruk |
| --- | --- | --- | --- | --- |
| `app.eiranova.no` | `main` | Production | prod (`wxyfwgxvfhpicmcpknxt`) | Sluttbrukere |
| `nurse.eiranova.no` | `main` | Production | prod | Sluttbrukere |
| `admin.eiranova.no` | `main` | Production | prod | Sluttbrukere |
| `staging.app.eiranova.no` | `dev` | Preview (alias) | dev (`hlenyzppjodmkoaugzid`) | Test/QA |
| `staging.nurse.eiranova.no` | `dev` | Preview (alias) | dev | Test/QA |
| `staging.admin.eiranova.no` | `dev` | Preview (alias) | dev | Test/QA |
| `<auto-vercel>.vercel.app` | `feature/*` | Preview | dev | PR-review |

`oppstart` og `marketing` Vercel-prosjekter — uendret. De er midlertidige.

---

## Hvorfor

1. **Mental modell-rot:** "Vercel Production = dev-branch" er forvirrende navngivning. `staging.*`-prefikset gir tydelig skille.
2. **Fremtidig launch-trygghet:** når ekte sluttbrukere kommer til `app.eiranova.no`, må produksjon være isolert fra utviklingsarbeid.
3. **prod-Supabase eksisterer allerede** (K-DB-002 merget) — schema er på plass, klar til bruk.
4. **`dev` er 25 commits foran `main`** — main må oppdateres som første steg slik at production faktisk har Fase A/B1/B2 + auth + db-arbeid.

---

## Sekvens (kritisk rekkefølge)

**Hvis Vercel snus først, vil `app.eiranova.no` serve gammel kode i 25 commits.** Derfor må `main` oppdateres før Vercel-branchen byttes.

```
1. Lag K-ENV-003-spec + queue-update PR mot dev
2. Merge K-ENV-003 til dev
3. Lag dev → main merge PR
4. Merge dev til main (production-klar kode på main)
5. Endre Vercel Production Branch fra dev til main (3 prosjekter)
6. Verifiser at app/nurse/admin.eiranova.no fortsatt fungerer (nå fra main)
7. Legg til staging.* domener i Vercel (3 prosjekter, alias for dev)
8. Legg til CNAME-records i Domeneshop for staging.*
9. Vent på DNS-propagering + SSL-utstedelse (15-30 min)
10. Verifiser staging.*.eiranova.no fungerer mot dev-Supabase
11. Oppdater docs/ENVIRONMENTS.md
12. Marker K-ENV-003 som merged
```

---

## In scope

### Kode/dokumentasjon (Cursor)

1. **Lag K-ENV-003 spec-fil** i `docs/contracts/active/K-ENV-003.md`
2. **Queue-update:** legg til K-ENV-003 i `CONTRACT_QUEUE.json` med `status: active`. K-REFACTOR-001 → `paused` med `paused_reason: "Pause under K-ENV-003 deployment-omlegging"`. (Single-contract-rule overholdt.)
3. **Oppdater `docs/ENVIRONMENTS.md`** med ny tredelt modell (skjer i siste steg etter Vercel/DNS er på plass)
4. **CHANGELOG.md** — `[Unreleased]`-oppføring

### Vercel-konfigurasjon (Richard, manuelt i nettleser)

For hvert av de tre prosjektene (`eiranova-web`, `eiranova-nurse`, `eiranova-admin`):

1. **Settings → Git → Production Branch:** endre fra `dev` til `main`
2. **Settings → Environments:** verifiser at:
   - Production env-vars peker til prod-Supabase
   - Preview env-vars peker til dev-Supabase
3. **Settings → Domains:**
   - Behold eksisterende production-domain (`app.eiranova.no` / `nurse.eiranova.no` / `admin.eiranova.no`)
   - Legg til staging-alias: `staging.app.eiranova.no` / `staging.nurse.eiranova.no` / `staging.admin.eiranova.no`
   - Konfigurer staging-domain til å peke til `dev`-branch deployments

### DNS-konfigurasjon (Richard, manuelt i Domeneshop)

Legg til 3 nye CNAME-records:

| Hostname | Type | Verdi | TTL |
| --- | --- | --- | --- |
| `staging.app` | CNAME | `cname.vercel-dns.com` | 1 time |
| `staging.nurse` | CNAME | `cname.vercel-dns.com` | 1 time |
| `staging.admin` | CNAME | `cname.vercel-dns.com` | 1 time |

(Eksisterende `app`, `nurse`, `admin`, MX, SPF, DKIM, DMARC — uendret.)

### Verifisering

1. `app.eiranova.no` viser kode fra `main` (=siste merge fra `dev`)
2. `staging.app.eiranova.no` viser kode fra `dev`
3. `app.eiranova.no` bruker prod-Supabase (verifiser via env-badge i UI eller network-fane)
4. `staging.app.eiranova.no` bruker dev-Supabase
5. Samme for nurse-app og admin-app
6. SSL-sertifikat utstedt og gyldig for alle 6 domener

---

## Out of scope

- Endringer i prod-Supabase data (schema er allerede på plass via K-DB-002)
- Auth-konfigurasjon i prod-Supabase (Google OAuth, redirect URLs etc. — egen kontrakt hvis nødvendig)
- `oppstart` og `marketing` Vercel-prosjekter (forblir som de er)
- Migrering av eksisterende dev-data til prod-Supabase
- Branch protection-regler på `main` (egen oppfølging)

---

## Akseptkriterier

1. `main`-branchen er oppdatert med all kode fra `dev` (25 commits merget inn)
2. Alle tre Vercel-prosjekter har Production Branch = `main`
3. `app.eiranova.no`, `nurse.eiranova.no`, `admin.eiranova.no` serverer fra `main`-branch
4. `staging.app.eiranova.no`, `staging.nurse.eiranova.no`, `staging.admin.eiranova.no` serverer fra `dev`-branch
5. Production-domener bruker prod-Supabase env-vars (verifiserbart)
6. Staging-domener bruker dev-Supabase env-vars (verifiserbart)
7. SSL gyldig på alle 6 domener
8. `docs/ENVIRONMENTS.md` reflekterer ny modell
9. K-REFACTOR-001 er `paused` mens K-ENV-003 er `active`, deretter tilbake til `active` etter merge

---

## Deliverables

- `docs/contracts/active/K-ENV-003.md` (denne fila)
- `docs/contracts/CONTRACT_QUEUE.json` oppdatert
- `docs/contracts/DISCOVERIES.json` (eventuelle nye oppdagelser fra arbeidet)
- `docs/ENVIRONMENTS.md` oppdatert
- `docs/CHANGELOG.md` oppdatert
- Vercel-konfigurasjon endret manuelt (3 prosjekter)
- Domeneshop DNS oppdatert (3 nye records)

---

## Risiko og rollback

| Risiko | Mitigering | Rollback |
| --- | --- | --- |
| `main` blir snudd til Vercel før dev er merget — production serverer 25-commits-gammel kode | Kritisk rekkefølge: dev→main MERGE FØRST, så Vercel-bytte | Sett Vercel Production Branch tilbake til `dev` |
| prod-Supabase auth ikke konfigurert — login krasjer på `app.eiranova.no` | Akseptert: ingen ekte brukere ennå. Hvis krasj: Cursor logger som ny kontrakt | Bruk staging.app.eiranova.no for testing inntil prod-Supabase er konfigurert |
| DNS-propagering tar tid, staging.* fungerer ikke umiddelbart | Vent 15-30 min, eventuelt opp til 1 time globalt | Ingen — dette er normal DNS-oppførsel |
| SSL-utstedelse feiler for staging.* | Vercel re-trigger automatisk. Hvis feiler: slett og legg til domain på nytt | Bruk auto-generert vercel.app-URL inntil løst |
| K-REFACTOR-001 paused samtidig som vi vil starte Fase C | K-ENV-003 er kort (2-3 timer) — Fase C venter | K-REFACTOR-001 settes tilbake til `active` etter merge |

---

## Etter merge

1. K-ENV-003 → `merged` i CONTRACT_QUEUE.json
2. K-REFACTOR-001 → `active` igjen
3. Verifiser i CONTROL_CENTER.md at K-REFACTOR-001 er eneste active
4. Klar for Fase C (nurse-app skjerm-migrering)
