# EiraNova — datamodell (public schema)

> Oppdatert i sammenheng med **K-DB-001** (Supabase-migrasjoner under `supabase/migrations/`).
> Ingen autogenererte TypeScript-typer i denne kontrakten; det følger **K-AUTH-001** og senere arbeid.

## ER-oversikt (tekst)

### Kjerne (kunder, tjenester, oppdrag, vurderinger)

- `users` — brukerprofil (1:1 med `auth.users`, soft delete via `deleted_at`, rolle `user_role`).
- `parorende` — pårørende koblet til kunde (`user_id` → `users`).
- `tjeneste_kategorier` → `tjenester` — tjenestekatalog (pris, mva, varighet, `mva_risiko`).
- `sykepleiere` — fagperson-rad per bruker (`user_id` → `users`), status og kompetansefelter.
- `b2b_organisasjoner` → `b2b_brukere` — B2B-klienter og mottakere; brukes også som valgfri kobling på `oppdrag` (`b2b_org_id`, `b2b_bruker_id`).
- `oppdrag` — bestilling/oppdrag (status, tider, sted, betalingspeker).
- `oppdrag_endringer` — **append-only** endringslogg / GDPR-audit.
- `vurderinger` — én vurdering per oppdrag (unik `oppdrag_id`).

### Betaling + B2B

- `avtalemodeller` — Prismodeller / fakturatype (`faktura_type`).
- `betalinger` — Knyttet til `oppdrag` og/eller kunde, med `betaling_status`.
- `krediteringer` — B2C/B2B-kreditering, `kreditering_status`, støtter kreditnota-referanse.
- `b2b_fakturaer` — Perioder, status, EHF/PEPPOL-referanser.
- `kreditnota_seq` (sekvens) + funksjon `next_kreditnota_nr()` — menneskelesbar nøkkel (`KN-ÅÅÅÅ-xxx`).

### Personal og lønn

- `ansatte` — lønns- og ansettelsesdata koblet til `users`.
- `vikarer` / `bemanningsbyraaer` — vikarflyt og evt. bemanningsintegrasjoner.
- `lonnkjoringer` — måned/sammendrag for lønnskjøring.
- `skattetrekk` — detaljlinjer knyttet til lønnskjøring og ansatt.

### Konfigurasjon og GDPR

- `dekningsomraader` — geografisk tjenestekonfigurasjon.
- `varslingsmottakere` — interne mottakere (epost, kanaler, varsler-JSON).
- `innstillinger` — **singleton** (én rad) med selskapsdata, toggles (`b2b_aktiv`), frister, MVA, osv.
- `push_varsler` — brukerpush i app.
- `system_events` — hendelseslogg (`severity_level`).
- `samtykker` — type + versjon; **ikke** slettbart (ingen DELETE-policy).
- `push_subscriptions` — PWA Web Push, unik per (`user_id`, `endpoint`).

## Antall tabeller

Det finnes **26** tabeller i `public` i K-DB-001-skjemaet (i tillegg til sekvens/funksjoner for kreditnota).

## Enums (tillatte verdier)

| Enum | Verdier |
|------|--------|
| `user_role` | `kunde`, `sykepleier`, `koordinator`, `admin` |
| `oppdrag_status` | `pending`, `bekreftet`, `tildelt`, `aktiv`, `fullfort`, `avlyst` |
| `betaling_metode` | `vipps`, `stripe`, `ehf`, `kredittnota` |
| `betaling_status` | `venter`, `betalt`, `feilet`, `refundert` |
| `mva_risiko` | `lav`, `medium`, `høy` |
| `b2b_type` | `kommune`, `borettslag`, `bedrift` |
| `faktura_type` | `maanedlig`, `per_oppdrag`, `engang`, `kvartal` |
| `severity_level` | `SEV1`, `SEV2`, `SEV3`, `INFO` |
| `samtykke_type` | `gdpr`, `vilkaar`, `markedsfoering` |
| `sykepleier_status` | `aktiv`, `venter_godkjenning`, `inaktiv` |
| `kreditering_status` | `initiert`, `refundert`, `sendt` |
| `kreditering_metode` | `vipps`, `stripe`, `kreditnota` |
| `b2b_faktura_status` | `usendt`, `sendt`, `forfalt`, `betalt` |
| `varsel_kanal` | `push`, `sms` |

## RLS-mønstre (oversikt)

- **Egen bruker** — `public.users` og egne rader: `id` / `user_id` sammenlignes med `auth.uid()`.
- **Lese for innloggede** — tjenestekatalog og `dekningsomrader` m.m.: `auth.uid() IS NOT NULL` for `SELECT` + `koordinator`/`admin` for full administrasjon.
- **Koordinator/Admin (operativt)** — `b2b_*`, mange økonomi- og støttetabeller, `varslingsmottakere`, `system_events`, m.m.: `current_user_role() IN ('koordinator','admin')` (lønn/ansatt/innstillinger er fortsatt `admin` der spec sier det).
- **Oppdrag** — kunde ser egne, sykepleier ser tildelte, koordinator/admin ser alt; policies speiler spec.
- **Append-only** — `oppdrag_endringer`: bare `INSERT` (uten restriksjon i `WITH CHECK` per spec) og `SELECT` for koordinator/admin; ingen `UPDATE`/`DELETE`.
- **Samtykker** — `SELECT` + `INSERT` for eier; **aldri** `DELETE` (ingen DELETE-policy; GDPR logg).
- **Vurderinger** — alle innloggede kan `SELECT`; kunder kan `INSERT` egen (via `kunde_id`).

Hjelpefunksjon: `current_user_role()` (SECURITY DEFINER, `STABLE` SQL) leser `users.role` for `auth.uid()`.

Trigger `on_auth_user_created` på `auth.users` kaller `handle_new_user()` og sørger for rad i `public.users` med `role = 'kunde'` når nye kontoer opprettes.

## MVA-risiko (revisor / lansering)

I seed (migrasjon `006`) er tjenestene **Besøksvenn & sosial støtte** og **Trilleturer & avlastning** satt til `mva_risiko = 'høy'`, i tråd med forretnings- og mva-usikkerhet. **Avklar MVA håndtering med revisor før lansering** — jf. D-005 i `DISCOVERIES.json`.
