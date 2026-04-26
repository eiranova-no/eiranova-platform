# K-LAUNCH-001 — Production Cut-over: Plattform til main

**Status:** planned
**Type:** governance
**Dependencies:** K-AUTH-002, K-DB-001 ✅, K-GDPR-001, K-PROFIL-001, K-BESTILL-001, K-OPPDRAG-001
**Author:** Claude (Technical Architect)
**Implementer:** Richard (manuell konfig) + Cursor (kodeendringer hvis nødvendig)

---

## Bakgrunn

Per dags dato (2026-04-26) deployer plattform-appene (kunde-app, nurse-app,
admin-app) fra `dev`-branchen til Vercel Production. Dette er en midlertidig
løsning som har fungert mens plattformen er under utvikling. `main`-branchen
brukes kun til de standalone HTML-appene `marketing` og `oppstart`, som er
midlertidige og skal avvikles ved lansering.

Når plattformen er klar for offentlig lansering, skal en strukturert
cut-over gjennomføres for å skille Preview (dev-data) fra Production
(prod-data) per `docs/PROCESS.md` og `docs/ENVIRONMENTS.md`.

## Mål

Etablere strikt branch-modell for plattformen ved lansering:
- `main` → Vercel Production → Supabase prod (`wxyfwgxvfhpicmcpknxt`)
- `dev` → Vercel Preview → Supabase dev (`hlenyzppjodmkoaugzid`)
- `feature/*` → Vercel Preview (per-PR) → Supabase dev

Avvikle `marketing` og `oppstart` som standalone-apper.

## In Scope

### Pre-cut-over (forberedelse)
- Verifiser at prod-Supabase har komplett skjema (alle migrasjoner kjørt)
- Verifiser at alle juridiske krav er oppfylt (org.nr., NHN-sertifisering hvis K-JOURNAL aktivert, helseadvokat-godkjenning)
- Backup av dev-Supabase (referanseskjema)
- Verifiser at alle kontrakter med `dependencies` til K-LAUNCH-001 er merget

### Cut-over (selve omleggingen)
- Konsolider `dev` og `main` historikk:
  - Beslutning: behold `main` som-er og merge `dev` inn, ELLER reset `main` til `dev` og deprekere oppstart/marketing-historikk
  - Anbefalt: opprett ny ren branch fra `dev`, slett gammel `main`, gi nye `main`-status
- Sett Vercel Production Branch → `main` for `eiranova-web`, `eiranova-nurse`, `eiranova-admin`
- Sett Vercel Production env-vars (scope: Production):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://wxyfwgxvfhpicmcpknxt.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<prod anon key>`
  - `NEXT_PUBLIC_APP_ENV` = `production`
  - `NEXT_PUBLIC_DATA_SOURCE` = `prod`
- Verifiser custom domener:
  - `app.eiranova.no` → `eiranova-web` Production
  - `nurse.eiranova.no` → `eiranova-nurse` Production
  - `admin.eiranova.no` → `eiranova-admin` Production
- Branch protection på `main`:
  - Require PR before merging
  - Require status checks: alle Build-jobs + Validate CONTRACT_QUEUE
  - Do not allow bypassing
- Redeploy alle tre prosjekter uten build cache

### Post-cut-over (avvikling og verifikasjon)
- Verifiser med `curl -I` mot alle tre custom domener (forvent 200/3xx, ikke 500)
- Avvikle `eiranova-marketing` Vercel-prosjektet (eller behold som arkiv)
- Avvikle `eiranova-oppstart` Vercel-prosjektet (eller behold som arkiv)
- Slett `apps/marketing/` og `apps/oppstart/` fra repoet (egen PR)
- Oppdater `docs/ENVIRONMENTS.md` til å reflektere endelig konfigurasjon
- Smoke-test: oppretting av testbruker, login, basis-flyt på alle tre apper

## Out of Scope

- Selve feature-utviklingen (dekkes av separate kontrakter)
- Migrering av brukerdata fra dev til prod (skal ikke skje — prod starter tomt)
- Marketing-content for lanseringen (separat oppgave)

## Acceptance Criteria

- [ ] `app.eiranova.no` returnerer 200/307 fra `main`-deploy
- [ ] `nurse.eiranova.no` returnerer 200/307 fra `main`-deploy
- [ ] `admin.eiranova.no` returnerer 200/307 fra `main`-deploy
- [ ] Alle tre apper bruker prod-Supabase (verifiser via Supabase dashboard at requests treffer prod-prosjektet)
- [ ] EnvBadge er skjult på alle tre apper i Production (verifiser i nettleser)
- [ ] Branch protection er aktivert på `main`
- [ ] `dev` → Preview-deploys fungerer fortsatt (regresjonstest)
- [ ] CI grønt på siste merge til `main`

## Definition of Done

- Alle akseptansekriterier oppfylt
- Cut-over kjørt uten regresjon
- `docs/ENVIRONMENTS.md` oppdatert
- CONTRACT_QUEUE.json oppdatert (K-LAUNCH-001 → merged)
- Eventuell post-mortem ved problemer dokumentert som discoveries

## Risks

- DNS-propagering kan ta opptil 24 timer → planlegg cut-over i lavtrafikk-vindu
- Prod-Supabase RLS må verifiseres før reelle brukere kommer inn
- Eventuelle hardkodede dev-URL-er i koden vil feile i Production → kjør grep før cut-over
- Hvis K-AUTH-002 ikke er ferdig: sykepleiere kan ikke logge inn → blokker for cut-over
- Vipps/Stripe/Tripletex-integrasjoner krever org.nr. som kan blokkere full lansering

## Pre-launch Checklist (utvides før cut-over)

- [ ] Org.nr. for EiraNova AS bekreftet
- [ ] Personvernerklæring publisert og lenket fra alle tre apper
- [ ] Brukervilkår publisert
- [ ] Kontakt-/supportadresse aktiv (`hei@eiranova.no` eller tilsvarende)
- [ ] GDPR-flyt verifisert (samtykke, dataportabilitet, soft-delete)
- [ ] RLS-policies testet mot prod-skjema
- [ ] Smoke-test gjennomført på Preview før cut-over
- [ ] Backup-strategi for prod-Supabase aktivert

## References

- `docs/PROCESS.md` — branching-modell
- `docs/ENVIRONMENTS.md` — endelig miljø-konfigurasjon
- `docs/contracts/active/K-ENV-002.md` — env-guard som K-LAUNCH-001 bygger på
- D-012, D-013 (fra K-ENV-002) — bør lukkes før eller som del av K-LAUNCH-001
