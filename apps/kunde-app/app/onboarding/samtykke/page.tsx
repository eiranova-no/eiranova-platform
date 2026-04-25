"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Samtykke } from "../../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingSamtykkePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const onNav = useCallback(() => {
    // prototype fallback; kunde bruker kundeOnFortsett
  }, []);

  const kundeOnFortsett = useCallback(
    async (s: { gdpr: boolean; vilkaar: boolean; markedsf: boolean }) => {
      if (!user?.id) return { error: "Ingen brukerøkt" };
      if (!s.gdpr || !s.vilkaar) return { error: "Mangler påkrevd samtykke" };
      const supabase = createClient();
      const now = new Date().toISOString();
      const rows: { user_id: string; type: "gdpr" | "vilkaar" | "markedsfoering"; versjon: string }[] = [
        { user_id: user.id, type: "gdpr", versjon: "1.0" },
        { user_id: user.id, type: "vilkaar", versjon: "1.0" },
      ];
      const { error: e1 } = await supabase.from("samtykker").insert(rows);
      if (e1) return { error: e1.message };
      if (s.markedsf) {
        const { error: e2 } = await supabase
          .from("samtykker")
          .insert({ user_id: user.id, type: "markedsfoering", versjon: "1.0" });
        if (e2) return { error: e2.message };
        const { error: e3 } = await supabase
          .from("users")
          .update({ marketing_consent: true })
          .eq("id", user.id);
        if (e3) return { error: e3.message };
      }
      const { error: e4 } = await supabase
        .from("users")
        .update({
          terms_accepted_at: now,
          gdpr_consent_at: now,
        })
        .eq("id", user.id);
      if (e4) return { error: e4.message };
      router.push("/onboarding");
      return {};
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
      <Samtykke onNav={onNav} kundeOnFortsett={kundeOnFortsett} />
    </div>
  );
}
