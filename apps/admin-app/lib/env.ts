/**
 * Environment variable accessor.
 *
 * IMPORTANT: All NEXT_PUBLIC_* references MUST be statically written as
 * `process.env.NEXT_PUBLIC_FOO` (not `process.env[name]`). Next.js webpack
 * plugin only inlines statically-referenced env vars into the client bundle.
 * Dynamic lookups via `process.env[someVar]` are NOT inlined and will fail
 * at runtime in the browser where `process.env` does not exist.
 *
 * See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

/**
 * K-REFACTOR-001 Fase D1: admin-app kobler ikke Supabase ennå (ekte auth i K-AUTH-002).
 * Tom streng når variabler mangler lar build kjøre; EnvBadge bruker kun APP_ENV/DATA_SOURCE.
 * Gjeninnfør validering (require-at-init) for SUPABASE_* når klienten kobles til.
 *
 * Arkitektur-kontekst: se discovery D-026 (docs/contracts/DISCOVERIES.json).
 */
export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE ?? "dev",
} as const;
