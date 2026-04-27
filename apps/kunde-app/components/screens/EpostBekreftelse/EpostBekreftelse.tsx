"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { colors } from "@eiranova/ui";

import { useLandingToast } from "../Landing/useLandingToast";
import { createClient } from "@/lib/supabase/client";

const C = colors;

export interface EpostBekreftelseProps {
  /** Vanligvis fra `?epost=` (URL-dekodet av page). */
  regEpost?: string;
}

export function EpostBekreftelse({ regEpost }: EpostBekreftelseProps) {
  const router = useRouter();
  const { toast, ToastContainer } = useLandingToast();
  const [sender, setSender] = useState(false);

  const vistEpost = (regEpost && String(regEpost).trim()) || "din e-postadresse";

  const epostTilResend = regEpost != null && String(regEpost).trim() !== "" ? String(regEpost).trim() : "";

  const onSendPaNytt = useCallback(async () => {
    if (!epostTilResend) {
      toast("Legg til e-post i adressen (?epost=) for å sende på nytt.", "err");
      return;
    }
    const supabase = createClient();
    setSender(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const emailRedirectTo = origin
      ? `${origin}/auth/callback?next=${encodeURIComponent("/onboarding/push")}`
      : undefined;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: epostTilResend,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });
    setSender(false);
    if (error) {
      toast(error.message, "err");
      return;
    }
    toast("Ny e-post sendt!", "ok");
  }, [epostTilResend, toast]);

  const onHarBekreftet = useCallback(() => {
    void router.push("/onboarding");
  }, [router]);

  return (
    <div className="phone fu" style={{ background: C.cream }}>
      <ToastContainer />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 28px",
          textAlign: "center",
          maxWidth: 540,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: C.greenBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            marginBottom: 22,
            border: `1px solid ${C.border}`,
          }}
          aria-hidden
        >
          📧
        </div>
        <div className="fr" style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
          Sjekk e-posten din
        </div>
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7, marginBottom: 26, maxWidth: 400 }}>
          Vi har sendt en bekreftelseslink til <strong style={{ color: C.navy }}>{vistEpost}</strong>. Klikk lenken for
          å aktivere kontoen.
        </div>
        <button
          type="button"
          onClick={onHarBekreftet}
          className="btn bp"
          style={{ width: "100%", maxWidth: 400, padding: "14px 0", fontSize: 14, borderRadius: 13, marginBottom: 12 }}
        >
          Jeg har bekreftet e-posten →
        </button>
        <button
          type="button"
          onClick={() => void onSendPaNytt()}
          disabled={sender}
          style={{
            background: "none",
            border: "none",
            color: C.green,
            fontSize: 12,
            cursor: sender ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            textDecoration: "underline",
            opacity: sender ? 0.6 : 1,
          }}
        >
          {sender ? "Sender …" : "Send på nytt"}
        </button>
      </div>
    </div>
  );
}
