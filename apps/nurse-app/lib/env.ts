function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See docs/ENVIRONMENTS.md for setup.`,
    );
  }
  return value;
}

export const env = {
  SUPABASE_URL: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE ?? "dev",
} as const;
