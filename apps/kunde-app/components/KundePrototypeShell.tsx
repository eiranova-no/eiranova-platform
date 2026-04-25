"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, type ComponentType } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import PrototypeAppImport from "../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";

const PrototypeApp = PrototypeAppImport as ComponentType<{
  forcedTab?: string | null;
  forcedScreen?: string | null;
  showPrototypeToolbar?: boolean;
  kundeSessionActive?: boolean;
  kundeOnLogout?: () => void;
  kundeRouterPush?: (path: string) => void;
}>;

const TAB_BY_PATH: Record<string, string> = {
  "/": "hjem",
  "/bestill": "bestill",
  "/mine": "mine",
  "/profil": "kunde-profil",
  "/oppdrag-i-gang": "oppdrag-i-gang",
  "/chat": "chat-kunde",
};

export function KundePrototypeShell() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const forcedScreen = useMemo(() => {
    if (pathname === "/") {
      return user ? "hjem" : "landing";
    }
    return TAB_BY_PATH[pathname] ?? "hjem";
  }, [pathname, user]);

  const kundeRouterPush = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const kundeOnLogout = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router, signOut]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, system-ui, sans-serif",
          color: "#2C3E35",
        }}
      >
        Laster …
      </div>
    );
  }

  return (
    <PrototypeApp
      forcedTab="kunde"
      forcedScreen={forcedScreen}
      showPrototypeToolbar={false}
      kundeSessionActive={Boolean(user)}
      kundeOnLogout={kundeOnLogout}
      kundeRouterPush={kundeRouterPush}
    />
  );
}
