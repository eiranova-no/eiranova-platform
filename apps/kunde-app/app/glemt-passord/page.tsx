"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { GlemtPassord } from "../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function GlemtPassordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const onNav = useCallback(
    (s: string) => {
      if (s === "login") router.push("/login");
    },
    [router],
  );

  const kundeSendReset = useCallback(
    async (email: string) => {
      await resetPassword(email);
    },
    [resetPassword],
  );

  return (
    <div className="pw-app">
      <GlemtPassord onNav={onNav} kundeSendReset={kundeSendReset} />
    </div>
  );
}
