"use client";

import type { MockNurse } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { ProfilHeader } from "../KundeProfil/KundeProfil";

const C = colors;

export interface BestillSteg3SykepleierProps {
  nurses: MockNurse[];
  /** `null` = EiraNova velger for meg. */
  chosenNurse: string | null;
  onSetChosen: (nurseName: string | null) => void;
  onBack: () => void;
  /** `null` = EiraNova auto-valg. Ellers valgt sykepleiers navn. */
  onGaaTilBetaling: (sykepleierNavn: string | null) => void;
}

/**
 * Steg 3/3: velg sykepleier (prototype Bestill steg 2).
 */
export function BestillSteg3Sykepleier({ nurses, chosenNurse, onSetChosen, onBack, onGaaTilBetaling }: BestillSteg3SykepleierProps) {
  return (
    <div className="phone fu">
      <ProfilHeader title="Velg sykepleier" onBack={onBack} backLabel="Dato og tid" centerTitle />
      <div className="sa" style={{ padding: 13 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onGaaTilBetaling(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onGaaTilBetaling(null);
            }
          }}
          className="card"
          style={{
            padding: "12px 14px",
            marginBottom: 12,
            cursor: "pointer",
            border: `2px solid ${chosenNurse === null ? C.green : C.border}`,
            background: chosenNurse === null ? C.greenBg : "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ✨
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 2 }}>EiraNova velger for meg</div>
              <div style={{ fontSize: 10, color: C.soft }}>Vi sender den best tilgjengelige sykepleieren til deg</div>
            </div>
            {chosenNurse === null && (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.navy,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 9,
          }}
        >
          Eller velg selv
        </div>

        {nurses.map((n) => {
          const avail = n.status === "available";
          const chosen = chosenNurse === n.name;
          return (
            <div
              key={n.name}
              role="button"
              tabIndex={0}
              onClick={() => onSetChosen(n.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSetChosen(n.name);
                }
              }}
              className="card"
              style={{
                padding: "12px 13px",
                marginBottom: 8,
                cursor: "pointer",
                border: `2px solid ${chosen ? C.green : C.border}`,
                opacity: avail ? 1 : 0.55,
                background: chosen ? C.greenBg : "white",
              }}
            >
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {n.av}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 1,
                      right: 1,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: avail ? "#16A34A" : C.soft,
                      border: "2px solid white",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{n.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 10 }}>⭐</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{n.rating}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.green, fontWeight: 500, marginBottom: 3 }}>
                    {n.tittel} · {n.erfaring}
                  </div>
                  <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.4, marginBottom: 5 }}>&quot;{n.bio}&quot;</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 }}>
                    {n.spesialitet.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 8,
                          background: C.greenXL,
                          color: C.green,
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: `0.5px solid ${C.border}`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, color: C.soft }}>📍 {n.omrade}</span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 7px",
                        borderRadius: 50,
                        fontWeight: 600,
                        background: avail ? "#F0FDF4" : C.goldBg,
                        color: avail ? "#16A34A" : C.goldDark,
                      }}
                    >
                      {avail ? "Ledig nå" : n.status === "on_assignment" ? "På oppdrag" : "Pause"}
                    </span>
                  </div>
                </div>
                {chosen && (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: C.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <button type="button" onClick={() => onGaaTilBetaling(chosenNurse)} className="btn bp bf" style={{ borderRadius: 11, marginTop: 4 }}>
          {chosenNurse ? `Fortsett med ${chosenNurse.split(" ")[0]} →` : "Gå til betaling →"}
        </button>
      </div>
    </div>
  );
}
