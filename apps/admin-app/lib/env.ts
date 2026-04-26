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

function requireValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See docs/ENVIRONMENTS.md for setup.`,
    );
  }
  return value;
}

export const env = {
  SUPABASE_URL: requireValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  SUPABASE_ANON_KEY: requireValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE ?? "dev",
} as const;
