"use client";

import { useCallback } from "react";

import { colors } from "@eiranova/ui";

const C = colors;

const EKSEMPLER: { icon: string; tekst: string }[] = [
  { icon: "🚶", tekst: "Sykepleieren er på vei til deg" },
  { icon: "⏰", tekst: "Påminnelse 1 time før besøk" },
  { icon: "📋", tekst: "Ny bestilling bekreftet" },
  { icon: "🔄", tekst: "Endringer i ditt oppdrag" },
];

export interface PushTillatelseProps {
  onNav: (skjerm: string) => void;
  kundeOnValg?: (allow: boolean) => void | Promise<void>;
}

export function PushTillatelse({ onNav, kundeOnValg }: PushTillatelseProps) {
  const handleValg = useCallback(
    (allow: boolean) => {
      if (kundeOnValg) {
        void kundeOnValg(allow);
        return;
      }
      onNav("samtykke");
    },
    [kundeOnValg, onNav],
  );

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
            width: 80,
            height: 80,
            borderRadius: 24,
            background: `linear-gradient(135deg,${C.green},${C.greenDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 24,
            boxShadow: `0 8px 30px ${C.green}44`,
          }}
          aria-hidden
        >
          🔔
        </div>
        <div className="fr" style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
          Hold deg oppdatert
        </div>
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7, marginBottom: 28 }}>
          Vi sender deg varsler når sykepleieren er på vei, hvis tidspunktet endres, eller ved viktige beskjeder om dine
          bestillinger.
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {EKSEMPLER.map((v) => (
            <div
              key={v.tekst}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: "white",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 20 }} aria-hidden>
                {v.icon}
              </span>
              <span style={{ fontSize: 12, color: C.navy, fontWeight: 500 }}>{v.tekst}</span>
              <span style={{ marginLeft: "auto", fontSize: 10, color: C.green, fontWeight: 600 }} aria-hidden>
                ✓
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => handleValg(true)}
          className="btn bp"
          style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13, marginBottom: 10 }}
        >
          🔔 Tillat varsler
        </button>
        <button
          type="button"
          onClick={() => handleValg(false)}
          style={{
            background: "none",
            border: "none",
            color: C.soft,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          Ikke nå — spør meg senere
        </button>
      </div>
    </div>
  );
}
