"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { colors, isValidEmail } from "@eiranova/ui";

import { useAuth } from "@/lib/auth/AuthProvider";

const C = colors;

type Steg = "epost" | "sendt";

export function GlemtPassord() {
  const router = useRouter();
  const { resetPassword, user, loading } = useAuth();

  const [steg, setSteg] = useState<Steg>("epost");
  const [epost, setEpost] = useState("");
  const [validerFeil, setValiderFeil] = useState("");
  const [sender, setSender] = useState(false);

  const tilbakeLogin = useCallback(() => {
    void router.push("/login");
  }, [router]);

  const sendLenke = useCallback(async () => {
    setValiderFeil("");
    const e = String(epost).trim();
    if (!e) {
      setValiderFeil("Skriv inn e-postadressen.");
      return;
    }
    if (!isValidEmail(e)) {
      setValiderFeil("Ugyldig e-postformat.");
      return;
    }
    setSender(true);
    const r = await resetPassword(e);
    setSender(false);
    if (r?.error) {
      setValiderFeil(r.error);
      return;
    }
    setSteg("sendt");
  }, [epost, resetPassword]);

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

  if (steg === "sendt") {
    return (
      <div className="phone fu" style={{ background: C.cream }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: C.greenBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              marginBottom: 20,
            }}
            aria-hidden
          >
            📧
          </div>
          <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            Sjekk innboksen
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.navy,
              lineHeight: 1.5,
              marginBottom: 16,
              maxWidth: 340,
            }}
          >
            Hvis e-posten er registrert hos oss, har vi sendt en lenke for å tilbakestille passordet.
          </div>
          <div
            style={{
              background: C.greenXL,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 10,
              color: C.navyMid,
              lineHeight: 1.6,
              marginBottom: 28,
              width: "100%",
            }}
          >
            Lenken er gyldig i 30 minutter. Sjekk spam-mappen hvis du ikke finner e-posten.
          </div>
          <button
            type="button"
            onClick={tilbakeLogin}
            style={{
              fontSize: 12,
              color: C.green,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            ← Tilbake til innlogging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone fu" style={{ background: C.cream }}>
      <div
        style={{
          padding: "24px 20px 20px",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
        }}
      >
        <button
          type="button"
          onClick={tilbakeLogin}
          style={{
            background: "rgba(255,255,255,.15)",
            border: "none",
            color: "white",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 12,
          }}
        >
          ← Tilbake
        </button>
        <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 2 }}>
          Glemt passord?
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Vi sender deg en lenke for å opprette nytt passord</div>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="glemt-passord-epost"
            style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 5 }}
          >
            Din e-postadresse
          </label>
          <input
            id="glemt-passord-epost"
            value={epost}
            onChange={(ev) => {
              setEpost(ev.target.value);
              if (validerFeil) setValiderFeil("");
            }}
            className="inp"
            type="email"
            autoComplete="email"
            placeholder="ola@example.com"
          />
        </div>
        {validerFeil && (
          <div style={{ fontSize: 12, color: C.danger, marginTop: -8, marginBottom: 12 }} role="alert">
            {validerFeil}
          </div>
        )}
        <button
          type="button"
          onClick={() => void sendLenke()}
          disabled={sender}
          className="btn bp"
          style={{
            width: "100%",
            padding: "13px 0",
            fontSize: 13,
            borderRadius: 11,
            opacity: sender ? 0.7 : 1,
          }}
        >
          {sender ? "Sender …" : "Send tilbakestillingslenke"}
        </button>
      </div>
    </div>
  );
}
