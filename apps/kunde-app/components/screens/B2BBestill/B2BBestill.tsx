"use client";

import { B2B_COORD_BRUKERE, PAKKER } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PhoneHeader } from "@/components/screens/B2B/PhoneHeader";

const C = colors;

type B2BBrukerRad = (typeof B2B_COORD_BRUKERE)[number];
type PakkeRad = (typeof PAKKER)[number];

export function B2BBestill() {
  const router = useRouter();
  const [valgtBruker, setValgtBruker] = useState<B2BBrukerRad | null>(null);
  const [valgtPakke, setValgtPakke] = useState<PakkeRad | null>(null);
  const [step, setStep] = useState(1);

  if (step === 3) {
    return (
      <div className="phone fu">
        <PhoneHeader title="Bekreft bestilling" onBack={() => setStep(2)} backLabel="Velg tjeneste" centerTitle />
        <div className="sa" style={{ padding: 14 }}>
          <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
            <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
              Bestilling registrert!
            </div>
            <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.6 }}>
              Faktura legges til neste månedlige samlefaktura til Moss Kommune via EHF/PEPPOL.
            </div>
          </div>
          <div className="card cp" style={{ marginBottom: 14 }}>
            {(
              [
                ["Bruker", valgtBruker?.name ?? "—"],
                ["Tjeneste", valgtPakke?.navn ?? "—"],
                [
                  "Pris",
                  valgtPakke ? `${valgtPakke.pris.toLocaleString("nb-NO")} kr ${valgtPakke.frekvens}` : "—",
                ],
                ["Faktura", "Samlefaktura · EHF/PEPPOL"],
                ["Betalingsfrist", "30 dager (kommune)"],
              ] as const
            ).map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 11,
                }}
              >
                <span style={{ color: C.soft }}>{l}</span>
                <span style={{ fontWeight: 600, color: C.navy }}>{v}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => router.push("/b2b/dashboard")}
            className="btn bp bf"
            style={{ borderRadius: 11 }}
          >
            Tilbake til oversikt
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="phone fu">
        <PhoneHeader
          title={`Velg tjeneste — ${valgtBruker?.name ?? ""}`}
          onBack={() => setStep(1)}
          backLabel="Velg bruker"
          centerTitle
        />
        <div className="sa" style={{ padding: 13 }}>
          <div
            style={{
              background: C.greenXL,
              borderRadius: 9,
              padding: "9px 12px",
              marginBottom: 12,
              border: `1px solid ${C.border}`,
              fontSize: 10,
              color: C.navyMid,
            }}
          >
            Priser er basert på <strong>rammeavtalen</strong> med Moss Kommune
          </div>
          <div
            className="fr"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.soft,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Enkeltbestilling
          </div>
          {PAKKER.filter((p) => !p.id.includes("ukespakke")).map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setValgtPakke(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setValgtPakke(p);
                }
              }}
              className="card"
              style={{
                padding: "11px 13px",
                marginBottom: 7,
                cursor: "pointer",
                border: `2px solid ${valgtPakke?.id === p.id ? C.green : C.border}`,
                background: valgtPakke?.id === p.id ? C.greenBg : "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: C.greenXL,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {p.ikon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{p.navn}</div>
                  <div style={{ fontSize: 9, color: C.soft }}>{p.beskrivelse}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.sky }}>{p.pris} kr</div>
                  <div style={{ fontSize: 8, color: C.soft }}>{p.frekvens}</div>
                </div>
              </div>
            </div>
          ))}
          <div
            className="fr"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.soft,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
              marginTop: 4,
            }}
          >
            Fast ukespakke
          </div>
          {PAKKER.filter((p) => p.id.includes("ukespakke")).map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setValgtPakke(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setValgtPakke(p);
                }
              }}
              className="card"
              style={{
                padding: "11px 13px",
                marginBottom: 7,
                cursor: "pointer",
                border: `2px solid ${valgtPakke?.id === p.id ? C.green : C.border}`,
                background: valgtPakke?.id === p.id ? C.greenBg : "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: valgtPakke?.id === p.id ? C.green : C.greenBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {p.ikon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{p.navn}</div>
                  <div style={{ fontSize: 9, color: C.soft }}>{p.beskrivelse}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6D28D9" }}>
                    {p.pris.toLocaleString("nb-NO")} kr
                  </div>
                  <div style={{ fontSize: 8, color: C.soft }}>{p.frekvens}</div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => valgtPakke && setStep(3)}
            className="btn bf"
            style={{
              borderRadius: 11,
              background: valgtPakke ? C.green : C.border,
              color: "white",
              marginTop: 4,
            }}
          >
            {valgtPakke ? `Bestill ${valgtPakke.navn} →` : "Velg en tjeneste"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone fu">
      <PhoneHeader
        title="Bestill på vegne av bruker"
        onBack={() => router.push("/b2b/dashboard")}
        backLabel="Dashboard"
        centerTitle
      />
      <div className="sa" style={{ padding: 13 }}>
        <div style={{ fontSize: 10, color: C.soft, marginBottom: 10, lineHeight: 1.5 }}>
          Velg hvilken bruker du vil bestille for. Fakturaen legges automatisk til kommunens samlefaktura.
        </div>
        {B2B_COORD_BRUKERE.filter((b) => b.aktiv).map((b) => (
          <div
            key={b.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              setValgtBruker(b);
              setStep(2);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setValgtBruker(b);
                setStep(2);
              }
            }}
            className="card"
            style={{
              padding: "12px 13px",
              marginBottom: 8,
              cursor: "pointer",
              border: `2px solid ${valgtBruker?.id === b.id ? C.green : C.border}`,
              background: valgtBruker?.id === b.id ? C.greenBg : "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: C.greenDark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {b.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{b.name}</div>
                <div style={{ fontSize: 9, color: C.soft, marginBottom: 4 }}>
                  {b.adresse} · f. {b.dob}
                </div>
                <div style={{ fontSize: 9, color: C.green, fontWeight: 500 }}>
                  Aktiv · {b.mnd_pris.toLocaleString("nb-NO")} kr/mnd
                </div>
              </div>
              {!b.digitalt ? (
                <span
                  style={{
                    fontSize: 8,
                    background: C.goldBg,
                    color: C.goldDark,
                    padding: "2px 7px",
                    borderRadius: 50,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Trenger koordinator
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
