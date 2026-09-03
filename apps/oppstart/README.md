# EiraNova Oppstart-app

Intern app for oppstartsplan og compliance-sjekkliste — brukt av Lise og Jeanett under ikke-medisinsk pilot mens EiraNova-plattformen utvikles.

## Formål

- Felles oppstartsplan fra AS-registrering til pilotstart (M2, november 2026)
- Compliance delt i «Nå» (ikke-medisinsk pilot) og «Helsetjeneste-sporet» (aktiveres ved beslutning om medisinske tjenester)
- Delt fremdrift i sanntid via Supabase
- Egne oppgaver (add/edit/delete) og kommentarer per oppgave

## Arkitektur

Ren statisk HTML med `@supabase/supabase-js` via ESM CDN (esm.sh). Ingen build-step. Samme deploy-mønster som `apps/marketing`.

### Supabase

- **Prosjekt:** `eiranova-oppstart` (separat fra eiranova-dev og eiranova-prod)
- **Ref:** `jvhfelvwzsqkmewecvfz`
- **Region:** eu-central-1 (Frankfurt) — GDPR
- **Tabeller:** `tasks`, `completions`, `comments`, `feedback`
- **Realtime:** aktivert på alle tabeller
- **RLS:** på, med åpen policy for anon (sikkerheten ligger i at anon-nøkkelen + passord deles kun med eierne)

Migreringer:

| Fil | Innhold |
|-----|---------|
| `supabase-migration.sql` | Skjema + seed (opprinnelig) |
| `supabase-migration-002-feedback.sql` | Feedback-tabell |
| `supabase-migration-003-status-2026-09.sql` | To eiere, ikke-medisinsk pilot, arkivering, status sept 2026 |

Migrering 003 er kjørt mot oppstart-prosjektet (sept 2026) og ligger i repo som dokumentasjon av det som er kjørt. Idempotent — trygg å re-kjøre.

### Tilgang

To-stegs gate: først passord (`GATE_PASSWORD` / `ADMIN_PASSWORD` i `index.html`), så navnevalg (Lise / Jeanett). Admin-passordet åpner Richards feedback-visning.

**NB:** Repoet er offentlig — passordene gir kun skjermgate, ikke sikkerhet. Skriv ikke helse-, person- eller eierforhold i kommentarene.

Brukervalget lagres i `localStorage`. Bytt bruker via navne-chippen øverst til høyre, eller «Bytt bruker» i mobilmenyen.

## Deploy

Vercel-prosjekt: `eiranova-oppstart` → root directory `apps/oppstart` → framework `Other` → production branch `main` (PR-kjede: feature → `dev` → `main`).

Ingen env-vars i Vercel — Supabase URL og anon-nøkkel er hardkodet i `index.html`. Dette er bevisst: ren statisk HTML, ingen build-step, enkel debugging.

`.env.local` i denne mappen brukes kun som referanse og er gitignored.

## Vedlikehold

### Legge til/endre standard-oppgaver

Legg til i en ny migreringsfil (idempotent `update` / `insert … on conflict`) og kjør mot oppstart-prosjektet. Ikke rediger historiske migreringer i etterkant uten behov.

### Endre seksjonstitler

Rediger `SECTION_META` i `index.html`. Compliance-seksjoner merket `later: true` vises under helsetjeneste-sporet og telles ikke i «Nå»-fremdriften.

### Endre brukere

Rediger `USERS`-arrayen i `index.html`. Historiske completions/comments beholder gamle navn — det er bevisst.

## Pensjonering

Appen brukes frem til pilotstart (M2, november 2026). Deretter:

1. Arkiver: slett Vercel-prosjektet `eiranova-oppstart` (mappen `apps/oppstart/` beholdes i repo som historikk)
2. Slett Supabase-prosjektet `eiranova-oppstart` (ref: `jvhfelvwzsqkmewecvfz`) når data ikke lenger trengs
3. Oppdater root README og CHANGELOG
