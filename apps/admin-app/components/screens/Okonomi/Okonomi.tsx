"use client";

import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";

import { LonnPanel } from "./LonnPanel";
import { PrisKalkulator } from "./PrisKalkulator";

const C = colors;

type OkonomiTab = "regnskap" | "lonn" | "kalkulator";

type MaanedKey = "jan-2026" | "feb-2026" | "mars-2026";

type TallRad = {
  inntektB2C: number;
  inntektB2B: number;
  refusjonerB2C: number;
  kreditnoterB2B: number;
  nettoInntekt: number;
  kostnader: number;
  resultat: number;
  antOppdrag: number;
  vippsVolum: number;
  stripeVolum: number;
  b2bFakturert: number;
  utestaaende: number;
};

export function Okonomi() {
  const [periode, setPeriode] = useState<MaanedKey>("mars-2026");
  const [eksportModal, setEksportModal] = useState<null | "daglig" | "maanedlig">(null);
  const [lonnTab, setLonnTab] = useState("oversikt");
  const [okonomiTab, setOkonomiTab] = useState<OkonomiTab>("regnskap");

  const maaneder: MaanedKey[] = ["jan-2026", "feb-2026", "mars-2026"];
  const tall: Record<MaanedKey, TallRad> = {
    "mars-2026": {
      inntektB2C: 47820,
      inntektB2B: 62300,
      refusjonerB2C: 1370,
      kreditnoterB2B: 1250,
      nettoInntekt: 107500,
      kostnader: 71200,
      resultat: 36300,
      antOppdrag: 187,
      vippsVolum: 47820,
      stripeVolum: 0,
      b2bFakturert: 62300,
      utestaaende: 33240,
    },
    "feb-2026": {
      inntektB2C: 41200,
      inntektB2B: 54900,
      refusjonerB2C: 780,
      kreditnoterB2B: 490,
      nettoInntekt: 94830,
      kostnader: 64100,
      resultat: 30730,
      antOppdrag: 162,
      vippsVolum: 41200,
      stripeVolum: 0,
      b2bFakturert: 54900,
      utestaaende: 6000,
    },
    "jan-2026": {
      inntektB2C: 38500,
      inntektB2B: 49200,
      refusjonerB2C: 590,
      kreditnoterB2B: 0,
      nettoInntekt: 87110,
      kostnader: 61800,
      resultat: 25310,
      antOppdrag: 148,
      vippsVolum: 38500,
      stripeVolum: 0,
      b2bFakturert: 49200,
      utestaaende: 0,
    },
  };
  const t = tall[periode] ?? tall["mars-2026"];

  const dagligBilag = [
    { dato: "2026-03-21", type: "Vipps oppgjør", ref: "VIPPS-DAG-0321", brutto: 4890, refusjoner: 390, netto: 4500, status: "matchet" as const, tripletexRef: "TT-24091" },
    { dato: "2026-03-20", type: "Vipps oppgjør", ref: "VIPPS-DAG-0320", brutto: 5280, refusjoner: 0, netto: 5280, status: "matchet" as const, tripletexRef: "TT-24088" },
    { dato: "2026-03-19", type: "B2B innbetaling", ref: "KID-18750-MK", brutto: 18750, refusjoner: 0, netto: 18750, status: "matchet" as const, tripletexRef: "TT-24082" },
    { dato: "2026-03-18", type: "Vipps oppgjør", ref: "VIPPS-DAG-0318", brutto: 3910, refusjoner: 0, netto: 3910, status: "matchet" as const, tripletexRef: "TT-24079" },
    { dato: "2026-03-17", type: "Vipps oppgjør", ref: "VIPPS-DAG-0317", brutto: 4120, refusjoner: 780, netto: 3340, status: "avvik" as const, tripletexRef: null as string | null },
    { dato: "2026-03-14", type: "B2B innbetaling", ref: "KID-6000-PB", brutto: 6000, refusjoner: 0, netto: 6000, status: "matchet" as const, tripletexRef: "TT-24071" },
  ];

  const mvaStatus = [
    { tjeneste: "Morgensstell & dusj", kategori: "Helsetjeneste", sats: "0% (unntatt §3-2)", risiko: "lav" as const, notat: "Klar helsefaglig tjeneste" },
    { tjeneste: "Praktisk bistand", kategori: "Helsetjeneste", sats: "0% (unntatt §3-2)", risiko: "lav" as const, notat: "Delegert fra kommunen" },
    { tjeneste: "Ringetilsyn", kategori: "Helsetjeneste", sats: "0% (unntatt §3-2)", risiko: "lav" as const, notat: "Medisinsk oppfølging" },
    { tjeneste: "Transport & ærender", kategori: "Grå sone", sats: "Avklares", risiko: "medium" as const, notat: "Avventer juridisk vurdering" },
    { tjeneste: "Avlastning pårørende", kategori: "Grå sone", sats: "Avklares", risiko: "medium" as const, notat: "Kan tolkes som velferd" },
    { tjeneste: "Besøksvenn", kategori: "Velferdsteneste", sats: "Avklares", risiko: "høy" as const, notat: "⚠️ Skatteetaten har krevd MVA her" },
    { tjeneste: "Trilleturer", kategori: "Velferdstjeneste", sats: "Avklares", risiko: "høy" as const, notat: "⚠️ Ikke klar helsefaglig tjeneste" },
    { tjeneste: "Barsel — Praktisk bistand", kategori: "Helsetjeneste", sats: "0% (unntatt §3-2)", risiko: "lav" as const, notat: "Jordmor-delegert omsorg" },
    { tjeneste: "Barsel — Samtale & støtte", kategori: "Grå sone", sats: "Avklares", risiko: "medium" as const, notat: "Avventer vurdering" },
  ];

  function Kort({
    label,
    value,
    sub,
    icon,
    color,
  }: {
    label: string;
    value: string | number;
    sub: string;
    icon: string;
    color?: string;
  }) {
    return (
      <div className="card cp">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.soft, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
          <span style={{ fontSize: 17 }}>{icon}</span>
        </div>
        <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: color ?? C.navy, marginBottom: 2 }}>
          {value}
        </div>
        <div style={{ fontSize: 9, color: C.soft }}>{sub}</div>
      </div>
    );
  }

  return (
    <div className="fu">
      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: 10,
          padding: 3,
          marginBottom: 18,
          border: `1px solid ${C.border}`,
          width: "fit-content",
        }}
      >
        {(
          [
            ["regnskap", "📊 Regnskap & bilag"],
            ["lonn", "💰 Lønn & ansatte"],
            ["kalkulator", "🧮 Priskalkulator"],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setOkonomiTab(tab)}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: okonomiTab === tab ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: okonomiTab === tab ? C.greenBg : "transparent",
              color: okonomiTab === tab ? C.green : C.soft,
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {okonomiTab === "lonn" && <LonnPanel lonnTab={lonnTab} setLonnTab={setLonnTab} />}
      {okonomiTab === "kalkulator" && <PrisKalkulator />}
      {okonomiTab === "regnskap" && (
        <>
          {eksportModal && (
            <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
              <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                    borderRadius: "16px 16px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "white" }}>📤 Eksporter til Tripletex</div>
                  <button
                    type="button"
                    onClick={() => setEksportModal(null)}
                    style={{
                      background: "rgba(255,255,255,.15)",
                      border: "none",
                      color: "white",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
                    {eksportModal === "daglig" ? "Daglig bilagseksport" : "Månedlig regnskapsrapport"} — {periode}
                  </div>
                  {(
                    [
                      { fmt: "Tripletex CSV", icon: "📊", sub: "Direkte import i Tripletex → Regnskap → Importer bilag" },
                      { fmt: "Standard Visma/SAF-T XML", icon: "📄", sub: "SAF-T format — norsk standard for regnskapsdata" },
                      { fmt: "PDF rapport", icon: "🖨️", sub: "Lesbar rapport for revisor og styret" },
                    ] as const
                  ).map((f) => (
                    <div
                      key={f.fmt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderRadius: 9,
                        border: `1.5px solid ${C.border}`,
                        cursor: "pointer",
                        marginBottom: 8,
                        background: "white",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.green;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{f.fmt}</div>
                        <div style={{ fontSize: 10, color: C.soft }}>{f.sub}</div>
                      </div>
                      <button type="button" className="btn bp" style={{ fontSize: 10, padding: "5px 12px", borderRadius: 7 }}>
                        Last ned
                      </button>
                    </div>
                  ))}
                  <div
                    style={{
                      background: C.greenXL,
                      borderRadius: 9,
                      padding: "9px 12px",
                      fontSize: 10,
                      color: C.navyMid,
                      lineHeight: 1.6,
                      marginTop: 4,
                    }}
                  >
                    💡 Tripletex-importen bruker bankfeed-matching automatisk. Kontaktperson: din regnskapsfører.
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {maaneder.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPeriode(m)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: periode === m ? 600 : 400,
                    border: periode === m ? `1.5px solid ${C.green}` : `1px solid ${C.border}`,
                    background: periode === m ? C.greenBg : "white",
                    color: periode === m ? C.green : C.soft,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {m === "mars-2026" ? "Mars 2026" : m === "feb-2026" ? "Feb 2026" : "Jan 2026"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setEksportModal("daglig")}
                style={{
                  fontSize: 11,
                  padding: "7px 14px",
                  borderRadius: 9,
                  background: "white",
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                📤 Eksporter bilag
              </button>
              <button
                type="button"
                onClick={() => setEksportModal("maanedlig")}
                className="btn bp"
                style={{ fontSize: 11, padding: "7px 14px", borderRadius: 9 }}
              >
                📊 Månedlig rapport
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
            <Kort
              label="Brutto inntekt"
              value={`${((t.inntektB2C + t.inntektB2B) / 1000).toFixed(1)}k kr`}
              sub={`B2C: ${(t.inntektB2C / 1000).toFixed(1)}k · B2B: ${(t.inntektB2B / 1000).toFixed(1)}k`}
              icon="💰"
              color={C.green}
            />
            <Kort
              label="Refusjoner / krediteringer"
              value={`-${((t.refusjonerB2C + t.kreditnoterB2B) / 1000).toFixed(1)}k kr`}
              sub={`B2C: ${t.refusjonerB2C} · B2B: ${t.kreditnoterB2B}`}
              icon="↩️"
              color={C.danger}
            />
            <Kort label="Netto inntekt" value={`${(t.nettoInntekt / 1000).toFixed(1)}k kr`} sub="Etter refusjoner og kreditnoter" icon="📈" color={C.sky} />
            <Kort label="Driftskostnader" value={`${(t.kostnader / 1000).toFixed(1)}k kr`} sub="Lønn, drift, lisenser" icon="📉" />
            <Kort
              label="Driftsresultat"
              value={`${(t.resultat / 1000).toFixed(1)}k kr`}
              sub={`Margin: ${Math.round((t.resultat / t.nettoInntekt) * 100)}%`}
              icon="🏦"
              color={t.resultat > 0 ? C.green : C.danger}
            />
            <Kort label="Oppdrag gjennomført" value={t.antOppdrag} sub="Fakturerte oppdrag" icon="✅" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))", gap: 16, marginBottom: 20 }}>
            <div className="card">
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                  Daglig bilagslogg
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ fontSize: 9, background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                    5 matchet
                  </span>
                  <span style={{ fontSize: 9, background: C.dangerBg, color: C.danger, padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                    1 avvik
                  </span>
                </div>
              </div>
              {dagligBilag.map((b, i) => (
                <div
                  key={b.ref}
                  style={{
                    padding: "10px 16px",
                    borderBottom: i < dagligBilag.length - 1 ? `1px solid ${C.border}` : "none",
                    background: b.status === "avvik" ? "#FFFBFB" : "white",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: b.status === "matchet" ? "#16A34A" : C.danger,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{b.type}</span>
                        {b.status === "avvik" && (
                          <span style={{ fontSize: 9, background: C.dangerBg, color: C.danger, padding: "1px 6px", borderRadius: 50, fontWeight: 600 }}>
                            ⚠️ Avvik
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 9, color: C.soft }}>
                        <span>{b.dato}</span>
                        <span style={{ fontFamily: "monospace" }}>{b.ref}</span>
                        {b.tripletexRef && <span style={{ color: C.green, fontFamily: "monospace" }}>{b.tripletexRef}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{b.netto.toLocaleString("nb-NO")} kr</div>
                      {b.refusjoner > 0 && <div style={{ fontSize: 9, color: C.danger }}>-{b.refusjoner} ref.</div>}
                    </div>
                  </div>
                  {b.status === "avvik" && (
                    <div
                      style={{
                        marginTop: 7,
                        padding: "6px 10px",
                        background: C.dangerBg,
                        borderRadius: 7,
                        fontSize: 10,
                        color: C.danger,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Bankfeed ikke matchet — manuell kontroll nødvendig</span>
                      <button
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: "2px 9px",
                          background: C.danger,
                          color: "white",
                          border: "none",
                          borderRadius: 5,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Løs
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                    Tripletex integrasjon
                  </span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  {(
                    [
                      { modul: "Bankfeed (DNB)", status: "aktiv", detalj: "Automatisk matching · Sist synkronisert: i dag 06:00", ok: true as boolean | null },
                      { modul: "EHF/PEPPOL-faktura", status: "aktiv", detalj: "Fakturerer kommuner direkte fra Tripletex", ok: true },
                      { modul: "Vipps-bilag", status: "aktiv", detalj: "Daglig CSV-import via Tripletex API", ok: true },
                      { modul: "Lønn", status: "ikke satt opp", detalj: "Tripletex Lønn — må konfigureres", ok: false },
                      { modul: "Årsoppgjør", status: "ikke aktuelt", detalj: "Aktiveres Nov/Des 2026", ok: null },
                    ] as const
                  ).map((m) => (
                    <div key={m.modul} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: m.ok === true ? "#16A34A" : m.ok === false ? C.danger : "#D1D5DB",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{m.modul}</div>
                        <div style={{ fontSize: 10, color: C.soft }}>{m.detalj}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: m.ok === true ? "#F0FDF4" : m.ok === false ? C.dangerBg : C.softBg,
                          color: m.ok === true ? "#16A34A" : m.ok === false ? C.danger : C.soft,
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      window.open("https://tripletex.no", "_blank");
                    }}
                    className="btn bp"
                    style={{ width: "100%", marginTop: 12, padding: "9px 0", fontSize: 12, borderRadius: 9 }}
                  >
                    Åpne Tripletex →
                  </button>
                </div>
              </div>

              <div className="card">
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                    Neste handlinger
                  </span>
                </div>
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {(
                    [
                      { prioritet: "høy" as const, tekst: "Løs bilagsavvik 17. mars", detalj: "Vipps-bilag ikke matchet mot bank", color: C.danger, icon: "⚠️" },
                      { prioritet: "høy" as const, tekst: "Sett opp Tripletex Lønn", detalj: "Nødvendig for A-melding og arbeidsgiveravgift", color: C.danger, icon: "🧾" },
                      { prioritet: "medium" as const, tekst: "Avklar MVA-status med revisor", detalj: "Besøksvenn og Trilleturer — risiko for etterbetaling", color: C.gold, icon: "⚖️" },
                      { prioritet: "lav" as const, tekst: "Aktiver Tripletex Årsoppgjør", detalj: "Sett opp mot regnskapsfører", color: C.soft, icon: "📅" },
                    ] as const
                  ).map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 9,
                        background: h.prioritet === "høy" ? C.dangerBg : h.prioritet === "medium" ? C.goldBg : C.softBg,
                        border: `1px solid ${h.color}22`,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{h.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{h.tekst}</div>
                        <div style={{ fontSize: 10, color: C.soft }}>{h.detalj}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                MVA-status per tjeneste
              </span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, background: "#F0FDF4", color: "#16A34A", padding: "2px 10px", borderRadius: 50, fontWeight: 600 }}>
                  ✓ Lav risiko: 5
                </span>
                <span style={{ fontSize: 9, background: C.goldBg, color: C.goldDark, padding: "2px 10px", borderRadius: 50, fontWeight: 600 }}>
                  ⚠ Medium: 2
                </span>
                <span style={{ fontSize: 9, background: C.dangerBg, color: C.danger, padding: "2px 10px", borderRadius: 50, fontWeight: 600 }}>
                  🔴 Høy: 2
                </span>
              </div>
            </div>
            <div style={{ padding: "10px 16px 4px" }}>
              <div
                style={{
                  background: "#FFF3E0",
                  borderRadius: 9,
                  padding: "9px 12px",
                  marginBottom: 12,
                  fontSize: 10,
                  color: "#92400E",
                  lineHeight: 1.6,
                  border: "1px solid #FDE68A",
                }}
              >
                ⚖️ <strong>Viktig:</strong> MVA-sats er satt til 0% (unntatt) for alle tjenester inntil videre. Tjenester merket
                &quot;Avklares&quot; kan risikere etterbetaling av 25% MVA hvis Skatteetaten klassifiserer dem som velferdstjenester.{" "}
                <strong>Avklar med revisor før lansering.</strong>
              </div>
            </div>
            <div className="tw">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Tjeneste</th>
                    <th>Kategori</th>
                    <th>MVA-sats</th>
                    <th>Risikonivå</th>
                    <th>Notat</th>
                  </tr>
                </thead>
                <tbody>
                  {mvaStatus.map((m) => (
                    <tr key={m.tjeneste} style={{ background: m.risiko === "høy" ? "#FFFBFB" : m.risiko === "medium" ? "#FFFDF5" : "white" }}>
                      <td style={{ fontWeight: 600 }}>{m.tjeneste}</td>
                      <td style={{ fontSize: 11, color: C.soft }}>{m.kategori}</td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 50,
                            fontWeight: 600,
                            background: m.sats.includes("0%") ? "#F0FDF4" : C.softBg,
                            color: m.sats.includes("0%") ? "#16A34A" : C.navyMid,
                          }}
                        >
                          {m.sats}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 50,
                            fontWeight: 600,
                            background: m.risiko === "lav" ? "#F0FDF4" : m.risiko === "medium" ? C.goldBg : C.dangerBg,
                            color: m.risiko === "lav" ? "#16A34A" : m.risiko === "medium" ? C.goldDark : C.danger,
                          }}
                        >
                          {m.risiko === "lav" ? "✓ Lav" : m.risiko === "medium" ? "⚠ Medium" : "🔴 Høy"}
                        </span>
                      </td>
                      <td style={{ fontSize: 10, color: C.soft }}>{m.notat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
