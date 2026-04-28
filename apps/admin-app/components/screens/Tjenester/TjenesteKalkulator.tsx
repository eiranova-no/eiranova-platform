"use client";

import { colors } from "@eiranova/ui";
import { useState } from "react";

const C = colors;

export interface TjenesteKalkulatorProps {
  varighet: number;
  navnTjeneste: string;
}

export function TjenesteKalkulator({ varighet, navnTjeneste }: TjenesteKalkulatorProps) {
  const [vis, setVis] = useState(false);
  const [margin, setMargin] = useState(25);

  const fastPerMnd = 2500 + 4200 + 3800 + 4500 + 5000 + 2000;
  const oppdragPerMnd = 180;
  const km = 8;

  const t = varighet / 60;
  const reise = km * 4.5;
  const overhead = (fastPerMnd / oppdragPerMnd) * (varighet / 60);

  const vikarSatsHoyt = 320;
  const vikarSatsLavt = 200;
  const vikarSnitt = vikarSatsHoyt * 0.55 + vikarSatsLavt * 0.45;
  const direkteVikar = vikarSnitt + reise;
  const kostVikar = direkteVikar + overhead;
  const breakEvenVikar = Math.ceil(kostVikar);
  const prisVikar = Math.ceil(kostVikar / (1 - margin / 100));

  const timeLonnMix = 275 * 0.6 + 225 * 0.4;
  const direkteFast = timeLonnMix * t * (1 + 0.141 + 0.12 + 0.02) + reise;
  const kostFast = direkteFast + overhead;
  const breakEvenFast = Math.ceil(kostFast);
  const prisFast = Math.ceil(kostFast / (1 - margin / 100));

  const grunnBase = timeLonnMix * t * 0.6 * (1 + 0.141 + 0.12 + 0.02);
  const tilleggDel = timeLonnMix * t * 0.4 * (1 + 0.141 + 0.12 + 0.02);
  const direkteHybrid = grunnBase + tilleggDel + reise;
  const kostHybrid = direkteHybrid + overhead;
  const breakEvenHybrid = Math.ceil(kostHybrid);
  const prisHybrid = Math.ceil(kostHybrid / (1 - margin / 100));

  const modeller = [
    {
      key: "vikar" as const,
      label: "🤝 Vikar ENK",
      breakEven: breakEvenVikar,
      anbefalt: prisVikar,
      direkteKost: Math.round(direkteVikar),
      overhead: Math.round(overhead),
      color: C.green,
      fordel: "Ingen faste lønnskostnader. Enkelt å skalere.",
      ulempe: "Vikaren er selvstendig — EiraNova har mindre kontroll.",
    },
    {
      key: "fast" as const,
      label: "👔 Fast ansatt",
      breakEven: breakEvenFast,
      anbefalt: prisFast,
      direkteKost: Math.round(direkteFast),
      overhead: Math.round(overhead),
      color: C.sky,
      fordel: "Forutsigbarhet. Full kontroll over kvalitet og tilgjengelighet.",
      ulempe: "Høye faste kostnader. Risiko ved lavt volum.",
    },
    {
      key: "hybrid" as const,
      label: "⚖️ Hybrid",
      breakEven: breakEvenHybrid,
      anbefalt: prisHybrid,
      direkteKost: Math.round(direkteHybrid),
      overhead: Math.round(overhead),
      color: C.gold,
      fordel: "Fleksibilitet. Grunnstilling gir trygghet for ansatt.",
      ulempe: "Mer administrativt komplekst.",
    },
  ];

  const billigst = modeller.reduce((a, b) => (a.breakEven < b.breakEven ? a : b));
  const dyreste = modeller.reduce((a, b) => (a.breakEven > b.breakEven ? a : b));

  if (!vis) {
    return (
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setVis(true)}
          style={{
            width: "100%",
            padding: "10px 0",
            fontSize: 12,
            borderRadius: 9,
            background: "#F5F3FF",
            color: "#5B21B6",
            border: "1px solid #C4B5FD",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <span>🧮</span> Beregn minimumspris & sammenlign modeller for {varighet} min
        </button>
      </div>
    );
  }

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 2 }}>
            🧮 Prisberegning — {navnTjeneste || "tjeneste"} ({varighet} min)
          </div>
          <div style={{ fontSize: 10, color: C.soft }}>
            Basert på {oppdragPerMnd} oppdrag/mnd og {km} km reise
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVis(false)}
          style={{ fontSize: 10, color: C.soft, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          Skjul ×
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>Ønsket margin</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{margin}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={50}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.green, cursor: "pointer" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {modeller.map((m) => (
          <div
            key={m.key}
            style={{
              borderRadius: 11,
              border: `2px solid ${m.key === billigst.key ? m.color : C.border}`,
              overflow: "hidden",
              background: m.key === billigst.key ? `${m.color}08` : "white",
              position: "relative",
            }}
          >
            {m.key === billigst.key && (
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  right: -1,
                  background: m.color,
                  color: "white",
                  fontSize: 8,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "0 9px 0 6px",
                }}
              >
                BILLIGST
              </div>
            )}
            <div style={{ padding: "10px 10px 4px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: m.color, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 9, color: C.soft, marginBottom: 4 }}>Break-even:</div>
              <div className="fr" style={{ fontSize: 16, fontWeight: 800, color: C.danger, marginBottom: 2 }}>
                {m.breakEven.toLocaleString("nb-NO")} kr
              </div>
              <div style={{ fontSize: 9, color: C.soft, marginBottom: 8 }}>Anbefalt ({margin}% margin):</div>
              <div className="fr" style={{ fontSize: 18, fontWeight: 800, color: m.color, marginBottom: 10 }}>
                {m.anbefalt.toLocaleString("nb-NO")} kr
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 7 }}>
                {[
                  { l: "Personalkost", v: `${m.direkteKost} kr` },
                  { l: "Overhead", v: `${m.overhead} kr` },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 3 }}>
                    <span style={{ color: C.soft }}>{r.l}</span>
                    <span style={{ color: C.navyMid, fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "8px 10px", background: `${m.color}10`, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 8, color: C.green, fontWeight: 600, marginBottom: 2 }}>✓ {m.fordel}</div>
              <div style={{ fontSize: 8, color: C.soft }}>⚠ {m.ulempe}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
          borderRadius: 10,
          padding: "12px 14px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,.5)",
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Billigst å drifte med
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{billigst.label}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
            Break-even: {billigst.breakEven.toLocaleString("nb-NO")} kr
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,.5)",
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Prisforskjell (billigst vs dyreste)
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4ABC9E" }}>
            +{(dyreste.anbefalt - billigst.anbefalt).toLocaleString("nb-NO")} kr/oppdrag
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
            = {Math.round(((dyreste.anbefalt - billigst.anbefalt) * oppdragPerMnd) / 1000)}k kr/mnd på {oppdragPerMnd} oppdrag
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          background: C.greenXL,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 10,
          color: C.navyMid,
          lineHeight: 1.6,
        }}
      >
        💡 Break-even = minimumspris for å ikke tape penger. Anbefalt pris inkluderer {margin}% margin til buffer og utbytte.
        Overhead fordeles på {oppdragPerMnd} oppdrag/mnd — økt volum gir lavere overhead per oppdrag.
      </div>
    </div>
  );
}
