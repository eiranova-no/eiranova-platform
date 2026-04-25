"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Onboarding } from "../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingHovedPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const onNav = useCallback(() => {}, []);

  const kundeOnboarding = useMemo(
    () => ({
      onSteg0Neste: async ({
        hvem,
        navn,
      }: {
        hvem: string;
        navn: string;
      }): Promise<{ error?: string }> => {
        if (!user?.id) return { error: "Mangler bruker" };
        if (hvem === "parorende" && String(navn).trim()) {
          const supabase = createClient();
          const { error } = await supabase.from("parorende").insert({
            user_id: user.id,
            navn: String(navn).trim(),
            relasjon: null,
          });
          if (error) return { error: error.message };
        }
        return {};
      },
      onSteg1Neste: async ({
        adresse,
        postnr,
        poststed,
      }: {
        adresse: string;
        postnr: string;
        poststed: string;
      }): Promise<{ error?: string }> => {
        if (!user?.id) return { error: "Mangler bruker" };
        const supabase = createClient();
        const { error } = await supabase
          .from("users")
          .update({
            address: adresse,
            postnr,
            poststed,
          })
          .eq("id", user.id);
        if (error) return { error: error.message };
        return {};
      },
      onFerdig: () => {
        router.push("/");
      },
    }),
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
      <Onboarding onNav={onNav} kundeOnboarding={kundeOnboarding} />
    </div>
  );
}
