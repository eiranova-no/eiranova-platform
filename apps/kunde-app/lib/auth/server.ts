import { createClient } from "@/lib/supabase/server";

/**
 * Server-only: leser Supabase auth-cookies via `@/lib/supabase/server` (SSR-mønster).
 * For RSC/layouts som skal skille Landing vs innlogget innhold.
 */
export async function getServerSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
