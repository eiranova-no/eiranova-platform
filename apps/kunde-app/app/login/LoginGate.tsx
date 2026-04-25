"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { Login } from "../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function LoginGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gate = searchParams.get("gate");
  const { signIn, signUp, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      void router.replace("/");
    }
  }, [user, loading, router]);

  const kundeAuth = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        return signIn(email, password);
      },
      onAfterSignIn: async () => {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: u } = await supabase
          .from("users")
          .select("address")
          .eq("id", session.user.id)
          .single();
        if (u?.address) {
          if (gate && gate.startsWith("/") && !gate.startsWith("/login")) {
            router.replace(gate);
            return;
          }
          router.replace("/");
        } else {
          router.replace("/onboarding/samtykke");
        }
      },
      signUp: async (email: string, password: string, fulltNavn: string) => {
        return signUp(email, password, fulltNavn);
      },
      onAfterSignUp: () => {
        router.push("/onboarding/push");
      },
    }),
    [gate, router, signIn, signUp],
  );

  const onNav = useCallback(
    (s: string) => {
      if (s === "glemt-passord") {
        router.push("/glemt-passord");
        return;
      }
      if (s === "ingen-invitasjon" || s === "landing" || s === "b2b-dashboard")
        return;
    },
    [router],
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, system-ui, sans-serif",
        }}
      >
        Laster …
      </div>
    );
  }
  if (user) {
    return null;
  }

  return (
    <div className="pw-app">
      <Login onNav={onNav} kundeAuth={kundeAuth} onMockKundeLogin={undefined} />
    </div>
  );
}
