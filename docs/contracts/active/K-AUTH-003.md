# K-AUTH-003 — E-postbekreftelse token_hash (enhetsuavhengig) + norsk mal

| Felt | Verdi |
|------|--------|
| **Status** | implementing |
| **Type** | feature |
| **Avhenger av** | K-AUTH-001, K-LAUNCH-001 auth-config |
| **Branch** | `feature/K-AUTH-003-email-confirm-token-hash` |

## Problem

Standard `{{ .ConfirmationURL }}` / PKCE `exchangeCodeForSession` krever at bekreftelseslenken åpnes i **samme nettleser** som signup (`code_verifier` er nettleser-bundet). Ekte brukere åpner e-post på mobil → exchange feiler → redirect til `/login`.

Observasjon 06.06.2026: Reidun, rhmorte@gmail.com.

## Mål

Bytt signup-bekreftelse til `token_hash` + `verifyOtp` på server (`/auth/confirm`). Folder inn norsk e-postmal via declarative `config.toml` (lukker D-041).

## Scope

- `apps/kunde-app/app/auth/confirm/route.ts` — `verifyOtp({ token_hash, type })`, redirect `next` eller `/login?confirm=feilet`
- `supabase/templates/confirmation.html` — norsk mal med `{{ .TokenHash }}`
- `supabase/config.toml` — `[auth.email.template.confirmation]`
- `config push` mot dev + prod etter merge (Richard)
- DISCOVERIES: D-041 resolved, D-043 (PKCE same-browser)

## Out of scope

- Glemt passord / reset-passord (fortsatt egen flyt)
- Nurse/admin OAuth

## Akseptansekriterier

- [ ] Registrer på PC, åpne bekreftelseslenke på **mobil** → lander på `/onboarding/push` (staging + prod)
- [ ] E-post på norsk, avsender `noreply@eiranova.no`
- [ ] `config push` på begge Supabase-prosjekter med mal inkludert
- [ ] Feil/utløpt token → `/login?confirm=feilet`

## Test (TC-AUTH-CROSS-001)

1. Staging: signup `staging.app.eiranova.no` på desktop
2. Åpne lenke på mobil → `/onboarding/push`
3. Prod: samme med fersk `+adresse` på `app.eiranova.no`

## Referanser

- D-041, D-043
- Supabase: Email Templates `{{ .TokenHash }}`, `verifyOtp` token_hash
