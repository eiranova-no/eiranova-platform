# K-AUTH-001 — Auth: Kunder (e-post + passord)

| Felt | Verdi |
|------|--------|
| **Status** | implementing |
| **Tid (est.)** | 4–5 t |
| **Avhenger av** | K-DB-001 (merget) |
| **Branch** | `feature/K-AUTH-001-kunde-auth` |

## Mål

Kunder autentiseres med e-post + passord via Supabase Auth. Ingen Magic Link i UI, ingen Google OAuth for privatkunde. Glemt passord med reset-lenke. Ny bruker: registrer → (e-postbekreftelse dersom aktivert) → push-tillatelse (boolean) → samtykke (GDPR + vilkår påkrevd, markedsføring valgfri) → onboarding (hvem/pårørende, adresse) → hjem.

Ingen RLS- eller skjemaendringer; bruker eksisterende `public.users`, `public.samtykker`, `public.parorende` fra K-DB-001.

## Scope

- `apps/kunde-app`: `@supabase/ssr` + `@supabase/supabase-js`, `middleware` med beskyttede stier, `lib/supabase` (klient/server + genererte typer), `AuthProvider` / `useAuth`, ruter mappet fra prototype-skjermer.
- `apps/prototype/...`: minimal endring — fjernet Google-knapp for privatkunde; Google-knapp for B2B uendret; Vipps uendret (disabled); eksporterte komponenter for gjenbruk.
- Infrastruktur (T-001): Resend + Supabase **Custom SMTP** og **Norske e-postmaller** + **URL Configuration** beskrevet nedenfor — utføres i Domeneshop, Resend, Supabase dashboard (ikke kode i repo utenom `.env.example` / dokumentasjon).

## Steg (implementasjon)

| Steg | Innhold | Status |
|------|---------|--------|
| T-000 | Branch, denne filen | done |
| T-001 | Resend: domene `send.eiranova.no` (MX, SPF, DKIM), API-nøkkel, Supabase SMTP (port 465, `smtp.resend.com`, bruker `resend`, passord = API key), tysklete maller på norsk, Site URL + Redirect URLs, `{{ .SiteURL }}/reset-passord` i reset-template | manuell (se under) |
| T-002 | `lib/supabase/client.ts`, `server.ts`, `middleware.ts` (session refresh) | done |
| T-003 | `supabase gen types` → `database.types.ts` | done |
| T-004 | `AuthProvider`, `useAuth` | done |
| T-005 | Ruter: `/login`, `/onboarding/...`, `/glemt-passord`, `/reset-passord`, hovedskjermer via `KundePrototypeShell` | done |
| T-006 | Registrer, innlogging, push-flagg, samtykke, onboarding med Supabase | done |
| T-007 | `PROTECTED_PATHS` + redirect til `/login?gate=` | done |
| T-008 | Logg ut: `kundeOnLogout` → `signOut` + `router.push("/login")` | done |
| T-009 | Fjern Google (privat) i prototype | done |
| T-010 | Røyktest (manuell, se under) | pending |
| T-011 | DISCOVERIES, `pnpm generate-cc`, CHANGELOG | done |
| T-012 | PR mot `dev` | pending |

## T-001 — Sjekkliste (produksjon / dev i Supabase)

1. Resend: verifiser `send.eiranova.no` (verdier fra [resend.com/domains](https://resend.com/domains)).
2. Resend: generer API-nøkkel (nøkkel i hemmelig lager, ikke i repo) — hører sammen med `EIRANOVA_RESEND_API_KEY` hvis egen pipeline bruker den; Supabase bruker den direkte i SMTP-feltet.
3. Supabase (eiranova-dev): **Auth → SMTP** som i kontraktskjema (noreply@send.eiranova.no, EiraNova, smtp.resend.com, 465, resend, passord = Resend API key).
4. **E-postmaller**: alle 4 oversatt til norsk; reset-lenke basert `{{ .SiteURL }}/reset-passord`.
5. **URL Configuration**: dev — `http://localhost:3001`; Redirect URLs: `http://localhost:3001/**`, `http://localhost:3001/reset-passord`, `https://app.eiranova.no/**` (juster etter produksjonsmål).

## Akseptansekriterier

- E-post + passord registrering: `auth.users` + `public.users` (trigger), `full_name` oppdatert.
- Innlogging riktig passord → hjem dersom `address` satt, ellers til onboarding (samtykke-sti etter spesifikasjon).
- Feil passord: melding *«E-post eller passord stemmer ikke.»* (avslører ikke om e-posten finnes).
- Glemt passord: nøytral melding, reset til `/reset-passord`, `updateUser({ password })`.
- Flyt: registrer → push → samtykke → onboarding → hjem, med persistering i `users` + `samtykker` (versjon `1.0`).
- Valgfri markedsføring: både `samtykker` og `users.marketing_consent`.
- Uinnlogget `GET /bestill` → 302 til `/login?...`.
- Ingen Magic Link / Google for privatkunde i denne flyten; Vipps forblir deaktivert.
- `pnpm --filter kunde-app build` grønn.

## Manuell test (T-010)

1. Registrer ny e-post, bekreft innboks (og Resend Logs).
2. Etter bekreftelse: push (ja/nei) → samtykke → onboarding (test begge hvem-valg) → hjem; verifiser rader i Supabase (users, samtykker, ev. parorende).
3. Logg ut, logg inn → direkte til hjem dersom adresse satt.
4. Glemt passord → e-post → nytt passord → inn til hjem.
5. Åpne `/bestill` i inkognito → innlogging.
6. Profil: logg ut fungerer.

## Documentation update checklist

- [x] `docs/contracts/active/K-AUTH-001.md` (denne filen)
- [x] `docs/contracts/DISCOVERIES.json` (D-008, D-009)
- [x] `docs/CHANGELOG.md` under [Unreleased]
- [x] `docs/status/CONTROL_CENTER.md` via `pnpm generate-cc`
- [ ] README status (ved merge — samsvar med prosess)

## Opphavsreferanser

- `docs/CURSOR-INSTRUKSJON.md` (K-AUTH-001, auth-regler)
- K-DB-001: `handle_new_user`, RLS, skjema
