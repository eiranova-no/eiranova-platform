# K-ENV-002 — Env-guard & Middleware Hardening

**Status:** active  
**Type:** governance  
**Dependencies:** K-ENV-001 ✅, K-AUTH-001 ✅  
**Author:** Claude (Technical Architect)  
**Implementer:** Cursor

---

## Bakgrunn

Production-deploy på `app.eiranova.no` feilet med `MIDDLEWARE_INVOCATION_FAILED` (2026-04-26 00:53). Rotårsak: `apps/kunde-app/middleware.ts` brukte `process.env.NEXT_PUBLIC_SUPABASE_URL!` (non-null assertion) uten validering. Når Production-scope manglet env-vars i Vercel, ble `createServerClient` kalt med `undefined` og kastet kryptisk feil.

K-ENV-001 (merged 2026-04-10) leverte env-vars og badge-system, men ikke `env-guard.ts` som var i scope. Denne kontrakten lukker det gapet og fjerner alle non-null-assertions i kunde-app.

## Mål

Hindre at fremtidig manglende env-vars kaster `MIDDLEWARE_INVOCATION_FAILED` i Vercel. Erstatt med tydelig feilmelding ved build/start: "Missing required environment variable: X. See docs/ENVIRONMENTS.md for setup."

## In Scope

- `apps/kunde-app/lib/env.ts` med `requireEnv` helper
- `apps/nurse-app/lib/env.ts` med samme mønster (forberedelse)
- `apps/admin-app/lib/env.ts` med samme mønster (forberedelse)
- Erstatte `process.env.NEXT_PUBLIC_SUPABASE_URL!` og `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!` med `env.SUPABASE_URL` og `env.SUPABASE_ANON_KEY` i kunde-app
- `EnvBadge`-komponent per app (kunde/nurse/admin)
- `.env.example` i repo-roten med alle fire NEXT_PUBLIC-variabler
- `tsconfig.json` + `next-env.d.ts` i nurse/admin for `@/`-alias
- CI-workflow: legge til `NEXT_PUBLIC_DATA_SOURCE: dev`

## Out of Scope

- Endringer i Vercel- eller Supabase-konfigurasjon (Richard)
- Opprettelse av `main`-branch eller branch protection (Richard)
- Endring av `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` (egen kontrakt senere hvis nødvendig)
- Implementering av Supabase-kall i nurse-app/admin-app

## Deliverables

- `apps/kunde-app/lib/env.ts`
- `apps/nurse-app/lib/env.ts`
- `apps/admin-app/lib/env.ts`
- `apps/kunde-app/components/EnvBadge.tsx`
- `apps/nurse-app/components/EnvBadge.tsx`
- `apps/admin-app/components/EnvBadge.tsx`
- `.env.example` (repo-root)
- `apps/nurse-app/tsconfig.json` + `next-env.d.ts`
- `apps/admin-app/tsconfig.json` + `next-env.d.ts`
- Oppdatert `apps/kunde-app/middleware.ts` (uten `!`)
- Oppdatert `apps/kunde-app/lib/supabase/client.ts` (uten `!`)
- Oppdatert `apps/kunde-app/lib/supabase/server.ts` (uten `!`)
- Oppdatert `apps/kunde-app/app/auth/callback/route.ts` (uten `!`)
- Oppdatert `.github/workflows/ci.yml`

## Acceptance Criteria

- [ ] Ingen `process.env.NEXT_PUBLIC_SUPABASE_*!` i kunde-app
- [ ] `requireEnv` kaster med klar melding når env-var mangler
- [ ] `EnvBadge` returnerer `null` når `APP_ENV === "production"`
- [ ] `EnvBadge` har `pointer-events: none` (blokkerer ikke UI)
- [ ] `pnpm --filter kunde-app build` passerer
- [ ] `pnpm --filter nurse-app build` passerer
- [ ] `pnpm --filter admin-app build` passerer
- [ ] CI grønt på feature-branch

## Definition of Done

- Alle akseptansekriterier oppfylt
- PR åpnet mot `dev` med diff og kommandoer kjørt
- `CONTRACT_QUEUE.json` oppdatert (K-ENV-002 → active → merged)
- `CONTROL_CENTER.md` regenerert via `pnpm generate-cc`

## Risks

- Prototype-filen bruker fortsatt `process.env` direkte. Fanget i D-012 (oppdater `DISCOVERIES.json`).
- `typecheck`-script mangler per app. Fanget i D-013.

## References

- Original K-ENV-001 spec: `docs/contracts/active/K-ENV-001.md` (om den finnes)
- Vercel feillogg: 2026-04-26 00:53:51, request ID r6kbm-1777157631491-fc22a079da6f
- `ENVIRONMENTS.md`: `docs/ENVIRONMENTS.md`
