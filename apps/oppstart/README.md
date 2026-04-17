# EiraNova Oppstart-app

Intern app for oppstartsplan og compliance-sjekkliste — brukt av Lise, Therese og Jeanett under manuell drift mens EiraNova-plattformen utvikles.

## Formål

- Felles oppstartsplan fra AS-registrering til første betalende kunde
- Compliance-sjekkliste for norsk helselovgivning og GDPR (helse- og omsorgstjenesteloven, helsepersonelloven, GDPR art. 9, forskrift om ledelse)
- Delt fremdrift i sanntid via Supabase
- Egne oppgaver (add/edit/delete) og kommentarer per oppgave

## Arkitektur

Ren statisk HTML med `@supabase/supabase-js` via ESM CDN (esm.sh). Ingen build-step. Samme deploy-mønster som `apps/marketing`.

### Supabase

- **Prosjekt:** `eiranova-oppstart` (separat fra eiranova-dev og eiranova-prod)
- **Ref:** `jvhfelvwzsqkmewecvfz`
- **Region:** eu-central-1 (Frankfurt) — GDPR
- **Tabeller:** `tasks`, `completions`, `comments`
- **Realtime:** aktivert på alle tre tabeller
- **RLS:** på, med åpen policy for anon (sikkerheten ligger i at anon-nøkkelen + passord deles kun med de tre)

Migrering ligger i `supabase-migration.sql` og kjøres manuelt i Supabase SQL Editor første gang (idempotent — trygg å re-kjøre).

### Tilgang

To-stegs gate: først passord (`eiranova2026`, i klartekst i `index.html` under `GATE_PASSWORD`), så navnevalg (Lise / Therese / Jeanett). Brukervalget lagres i `localStorage` så man slipper å velge hver gang.

For å bytte bruker: klikk på navne-chippen øverst til høyre, eller «Bytt bruker» i mobilmenyen.

## Deploy

Vercel-prosjekt: `eiranova-oppstart` → root directory `apps/oppstart` → framework `Other` → production branch `dev`.

Ingen env-vars i Vercel — Supabase URL og anon-nøkkel er hardkodet i `index.html`. Dette er bevisst: ren statisk HTML, ingen build-step, enkel debugging.

`.env.local` i denne mappen brukes kun som referanse og er gitignored.

## Vedlikehold

### Legge til/endre standard-oppgaver

Rediger `supabase-migration.sql` og re-kjør den i SQL Editor. `on conflict (default_id)` gjør den idempotent.

### Endre seksjonstitler

Rediger `SECTION_META`-objektet i `index.html`.

### Endre brukere

Rediger `USERS`-arrayen i `index.html`. Merk: eksisterende completions og comments refererer til gamle navn — håndteres manuelt hvis det noen gang blir nødvendig.

## Pensjonering

Når EiraNova-plattformen tar over oppstartsflyten:

1. Slett Vercel-prosjektet `eiranova-oppstart`
2. Slett Supabase-prosjektet `eiranova-oppstart` (ref: `jvhfelvwzsqkmewecvfz`)
3. Fjern `apps/oppstart/`-mappen
4. Oppdater root README og CHANGELOG
