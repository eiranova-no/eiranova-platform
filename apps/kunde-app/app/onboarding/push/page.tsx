"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PushTillatelse } from "../../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPushPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const onNav = useCallback(
    (s: string) => {
      if (s === "samtykke") router.push("/onboarding/samtykke");
    },
    [router],
  );

  const kundeOnValg = useCallback(
    async (allow: boolean) => {
      if (!user?.id) return;
      const supabase = createClient();
      await supabase
        .from("users")
        .update({ push_enabled: allow })
        .eq("id", user.id);
      router.push("/onboarding/samtykke");
    },
    [router, user?.id],
  );

  if (loading || !user) {
    return (
      <div
        className="pw-app"
        style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Laster …
      </div>
    );
  }

  return (
    <div className="pw-app">
      <PushTillatelse onNav={onNav} kundeOnValg={kundeOnValg} />
    </div>
  );
}
