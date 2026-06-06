"use client";

import { B2B_C } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const C = colors;

const DEFAULT_BRUKER_ID = "u1";

export function B2BBrukerAktivering() {
  const router = useRouter();
  const orgNavn = B2B_C[0].name;

  const [steg, setSteg] = useState(0);
  const [fulltNavn, setFulltNavn] = useState("");
  const [fdato, setFdato] = useState("");
  const [pin, setPin] = useState("");
  const [pinBek, setPinBek] = useState("");
  const [feil, setFeil] = useState({ fn: "", fd: "", pin: "" });

  const validerOgAktiver = () => {
    const e = { fn: "", fd: "", pin: "" };
    if (!fulltNavn.trim()) e.fn = "Fullt navn er påkrevd.";
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(fdato.trim())) e.fd = "Fødselsdato må være DD.MM.ÅÅÅÅ.";
    if (!/^\d{4}$/.test(pin)) e.pin = "PIN må være nøyaktig 4 siffer.";
    else if (pin !== pinBek) e.pin = "PIN og bekreft PIN er ikke like.";
    setFeil(e);
    if (e.fn || e.fd || e.pin) return;
    setSteg(1);
  };

  const tilOversikt = () => router.push(`/b2b/bruker?id=${DEFAULT_BRUKER_ID}`);

  if (steg === 1) {
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
            maxWidth: 540,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            Konto aktivert!
          </div>
          <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, marginBottom: 10 }}>{fulltNavn.trim()}</div>
          <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.65, marginBottom: 24, maxWidth: 400 }}>
            Du er koblet til <strong style={{ color: C.navy }}>{orgNavn}</strong>. Din koordinator vil nå sette opp
            tjenester for deg.
          </div>
          <button
            type="button"
            onClick={tilOversikt}
            className="btn bp"
            style={{ width: "100%", maxWidth: 400, padding: "14px 0", fontSize: 14, borderRadius: 13 }}
          >
            Gå til min oversikt →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone fu" style={{ background: C.cream }}>
      <div style={{ padding: "22px 20px 18px", background: "linear-gradient(160deg,#1A2E24,#2C5C52)", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            background: "rgba(255,255,255,.15)",
            border: "none",
            color: "white",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 10,
          }}
        >
          ← Tilbake
        </button>
        <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 4 }}>
          Aktiver din konto
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.65)", lineHeight: 1.5 }}>
          Du har mottatt en invitasjon fra {orgNavn}.
        </div>
      </div>
      <div
        style={{
          padding: "16px 20px 0",
          display: "flex",
          justifyContent: "flex-end",
          maxWidth: 540,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={tilOversikt}
          style={{ fontSize: 10, color: C.soft, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          Hopp over
        </button>
      </div>
      <div className="sa" style={{ padding: "12px 22px 24px", maxWidth: 540, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
            Fullt navn
          </label>
          <input
            className="inp"
            value={fulltNavn}
            onChange={(e) => {
              setFulltNavn(e.target.value);
              if (feil.fn) setFeil((f) => ({ ...f, fn: "" }));
            }}
            placeholder="Ola Nordmann"
          />
          {feil.fn ? <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{feil.fn}</div> : null}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
            Fødselsdato
          </label>
          <input
            className="inp"
            value={fdato}
            onChange={(e) => {
              setFdato(e.target.value);
              if (feil.fd) setFeil((f) => ({ ...f, fd: "" }));
            }}
            placeholder="DD.MM.ÅÅÅÅ"
            inputMode="numeric"
          />
          {feil.fd ? <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{feil.fd}</div> : null}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
            Ny PIN (4 siffer)
          </label>
          <input
            className="inp"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
            Bekreft PIN
          </label>
          <input
            className="inp"
            type="password"
            inputMode="numeric"
            value={pinBek}
            onChange={(e) => {
              setPinBek(e.target.value.replace(/\D/g, "").slice(0, 4));
              if (feil.pin) setFeil((f) => ({ ...f, pin: "" }));
            }}
          />
          {feil.pin ? <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{feil.pin}</div> : null}
        </div>
        <button
          type="button"
          onClick={validerOgAktiver}
          className="btn bp"
          style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13 }}
        >
          Aktiver konto →
        </button>
      </div>
    </div>
  );
}
