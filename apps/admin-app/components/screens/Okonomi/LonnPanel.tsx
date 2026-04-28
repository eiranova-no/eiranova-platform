"use client";

import { ANSATTE_LONN, LONNKJORINGER, TARIFF_INFO } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";
import { useAdminToast } from "@/components/admin/useAdminToast";

const C = colors;

type AnsattLonnRow = (typeof ANSATTE_LONN)[number];

export interface LonnPanelProps {
  lonnTab: string;
  setLonnTab: (tab: string) => void;
}

export function LonnPanel({ lonnTab, setLonnTab }: LonnPanelProps) {
  const { toast, ToastContainer } = useAdminToast();
  const [valgtAnsatt, setValgtAnsatt] = useState<AnsattLonnRow | null>(null);

  const totalBrutto = ANSATTE_LONN.reduce((s, a) => s + a.bruttoLonn, 0);
  const totalNetto = ANSATTE_LONN.reduce((s, a) => s + a.nettoUtbetalt, 0);
  const totalAG = ANSATTE_LONN.reduce((s, a) => s + a.agAvgift, 0);
  const totalFerie = ANSATTE_LONN.reduce((s, a) => s + a.feriepenger, 0);
  const lonnKjoring = LONNKJORINGER[0];

  return (
    <div>
      <ToastContainer />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        {[
          { l: "Total bruttolønn", v: `${(totalBrutto / 1000).toFixed(1)}k kr`, s: `${ANSATTE_LONN.length} ansatte`, icon: "💼", c: C.navy },
          { l: "Total nettoutbetaling", v: `${(totalNetto / 1000).toFixed(1)}k kr`, s: "Til ansattes kontoer", icon: "🏦", c: C.green },
          { l: "Arbeidsgiveravgift", v: `${(totalAG / 1000).toFixed(1)}k kr`, s: `${TARIFF_INFO.agAvgiftSats}% av bruttolønn`, icon: "🏛️", c: C.gold },
          { l: "Feriepenger", v: `${(totalFerie / 1000).toFixed(1)}k kr`, s: `${TARIFF_INFO.feriepengeSats}% avsatt`, icon: "🌴", c: C.sky },
          {
            l: "OTP-pensjon",
            v: `${(ANSATTE_LONN.reduce((s, a) => s + a.pensjon, 0) / 1000).toFixed(1)}k kr`,
            s: `Min ${TARIFF_INFO.otpSats}% av lønn`,
            icon: "🔐",
            c: C.navyMid,
          },
        ].map((k) => (
          <div key={k.l} className="card cp">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  lineHeight: 1.3,
                }}
              >
                {k.l}
              </span>
              <span>{k.icon}</span>
            </div>
            <div className="fr" style={{ fontSize: 19, fontWeight: 700, color: k.c, marginBottom: 2 }}>
              {k.v}
            </div>
            <div style={{ fontSize: 9, color: C.soft }}>{k.s}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: 9,
          padding: 3,
          marginBottom: 16,
          border: `1px solid ${C.border}`,
          width: "fit-content",
        }}
      >
        {(
          [
            ["oversikt", "👥 Ansatte"],
            ["lonnkjoring", "▶️ Lønnskjøring"],
            ["skatt", "🏛️ Skattetrekk & avgift"],
            ["tariff", "📋 Tariff & regler"],
            ["amelding", "📤 A-melding"],
          ] as const
        ).map(([t, l]) => (
          <button
            key={t}
            type="button"
            onClick={() => setLonnTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: lonnTab === t ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: lonnTab === t ? C.greenBg : "transparent",
              color: lonnTab === t ? C.green : C.soft,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {lonnTab === "oversikt" && (
        <div>
          {valgtAnsatt && (
            <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  width: "100%",
                  maxWidth: 560,
                  maxHeight: "90vh",
                  overflow: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,.25)",
                }}
              >
                <div
                  style={{
                    padding: "18px 22px",
                    background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                    borderRadius: "18px 18px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {valgtAnsatt.av}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>{valgtAnsatt.navn}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                        {valgtAnsatt.tittel} · {valgtAnsatt.stillingsprosent}%
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValgtAnsatt(null)}
                    style={{
                      background: "rgba(255,255,255,.15)",
                      border: "none",
                      color: "white",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
                    Lønnsspesifikasjon — Mars 2026
                  </div>
                  {(
                    [
                      { l: "Grunnlønn", v: valgtAnsatt.grunnlonn, type: "inntekt" as const },
                      { l: "Helgetillegg", v: valgtAnsatt.tilleggHelg, type: "tillegg" as const },
                      { l: "Kvelstillegg", v: valgtAnsatt.tilleggKveld, type: "tillegg" as const },
                      { l: "Reisegodtgjørelse", v: valgtAnsatt.reise, type: "tillegg" as const },
                      { l: "Bruttolønn", v: valgtAnsatt.bruttoLonn, type: "sum" as const },
                      {
                        l: `Skattetrekk (${valgtAnsatt.trekkProsent}%)`,
                        v: -(valgtAnsatt.bruttoLonn - valgtAnsatt.nettoUtbetalt),
                        type: "trekk" as const,
                      },
                      { l: "Netto utbetalt", v: valgtAnsatt.nettoUtbetalt, type: "netto" as const },
                    ] as const
                  ).map((r) => (
                    <div
                      key={r.l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: `${r.type === "sum" || r.type === "netto" ? "9px" : "6px"} 0`,
                        borderBottom: `1px solid ${C.border}`,
                        borderTop: r.type === "sum" ? `2px solid ${C.border}` : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: r.type === "sum" || r.type === "netto" ? 700 : 400,
                          color: C.navyMid,
                        }}
                      >
                        {r.l}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: r.type === "sum" || r.type === "netto" ? 700 : 500,
                          color: r.type === "trekk" ? C.danger : r.type === "netto" ? C.green : C.navy,
                        }}
                      >
                        {r.v > 0 ? "+" : ""}
                        {r.v.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, background: C.goldBg, borderRadius: 9, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDark, marginBottom: 8 }}>
                      Arbeidsgiverside (ikke synlig for ansatt)
                    </div>
                    {(
                      [
                        { l: "Bruttolønn", v: valgtAnsatt.bruttoLonn },
                        { l: `Arbeidsgiveravgift (${TARIFF_INFO.agAvgiftSats}%)`, v: valgtAnsatt.agAvgift },
                        { l: `Feriepenger avsatt (${TARIFF_INFO.feriepengeSats}%)`, v: valgtAnsatt.feriepenger },
                        { l: `OTP-pensjon (${TARIFF_INFO.otpSats}%)`, v: valgtAnsatt.pensjon },
                      ] as const
                    ).map((r) => (
                      <div
                        key={r.l}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "5px 0",
                          borderBottom: "1px solid rgba(196,149,106,.2)",
                          fontSize: 11,
                        }}
                      >
                        <span style={{ color: C.goldDark }}>{r.l}</span>
                        <span style={{ fontWeight: 600, color: C.goldDark }}>{r.v.toLocaleString("nb-NO")} kr</span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.goldDark,
                      }}
                    >
                      <span>Total kostnad for EiraNova</span>
                      <span>
                        {(
                          valgtAnsatt.bruttoLonn +
                          valgtAnsatt.agAvgift +
                          valgtAnsatt.feriepenger +
                          valgtAnsatt.pensjon
                        ).toLocaleString("nb-NO")}{" "}
                        kr
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => toast("Lønnslipp genereres fra Tripletex")}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        fontSize: 12,
                        borderRadius: 9,
                        background: C.greenBg,
                        color: C.green,
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      📄 Last ned lønnslipp
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("Lønnsendring registreres i Tripletex", "warn")}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        fontSize: 12,
                        borderRadius: 9,
                        background: "white",
                        color: C.navy,
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ✏️ Endre lønn
                    </button>
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}
          <div className="card tw">
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
                Ansatte — lønnsdetaljer
              </span>
              <button
                type="button"
                onClick={() => toast("Åpner ansatt-registrering — kobles til Tripletex Lønn", "warn")}
                className="btn bp"
                style={{ fontSize: 11, padding: "6px 14px" }}
              >
                + Ny ansatt
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Stilling</th>
                  <th>Prosent</th>
                  <th>Grunnlønn</th>
                  <th>Brutto</th>
                  <th>Netto utbetalt</th>
                  <th>AG-kostnad</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {ANSATTE_LONN.map((a) => (
                  <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => setValgtAnsatt(a)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {a.av}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{a.navn}</div>
                          <div style={{ fontSize: 9, color: C.soft }}>{a.lonnstrinn}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 11 }}>{a.tittel}</td>
                    <td style={{ fontSize: 11 }}>{a.stillingsprosent}%</td>
                    <td style={{ fontSize: 11 }}>{a.grunnlonn.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontSize: 11, fontWeight: 600 }}>{a.bruttoLonn.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
                      {a.nettoUtbetalt.toLocaleString("nb-NO")} kr
                    </td>
                    <td style={{ fontSize: 11, color: C.goldDark }}>
                      {(a.bruttoLonn + a.agAvgift + a.feriepenger + a.pensjon).toLocaleString("nb-NO")} kr
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 50,
                          background: a.sykmeldt ? "#FFF3E0" : "#F0FDF4",
                          color: a.sykmeldt ? "#E65100" : "#16A34A",
                          fontWeight: 600,
                        }}
                      >
                        {a.sykmeldt ? "Sykmeldt" : "Aktiv"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: "3px 9px",
                          background: C.greenBg,
                          color: C.green,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setValgtAnsatt(a);
                        }}
                      >
                        Detaljer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lonnTab === "lonnkjoring" && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
                  Mars 2026 — Planlagt kjøring
                </div>
                <div style={{ fontSize: 11, color: C.soft }}>Utbetalingsdato: 25. mars 2026</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => toast("PDF-forhåndsvisning genereres fra Tripletex")}
                  style={{
                    fontSize: 12,
                    padding: "8px 16px",
                    borderRadius: 9,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  📄 Forhåndsvis lønnsslipp
                </button>
                <button
                  type="button"
                  onClick={() => toast("Lønnskjøring startet — betaling 25. mars", "ok")}
                  className="btn bp"
                  style={{ fontSize: 12, padding: "8px 18px", borderRadius: 9 }}
                >
                  ▶️ Kjør lønn nå
                </button>
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                {[
                  { l: "Brutto å utbetale", v: `${(lonnKjoring.totalBrutto / 1000).toFixed(1)}k kr` },
                  { l: "Netto til ansatte", v: `${(lonnKjoring.totalNetto / 1000).toFixed(1)}k kr` },
                  { l: "Skattetrekk", v: `${((lonnKjoring.totalBrutto - lonnKjoring.totalNetto) / 1000).toFixed(1)}k kr` },
                  { l: "Arbeidsgiveravgift", v: `${(lonnKjoring.agAvgift / 1000).toFixed(1)}k kr` },
                  { l: "Feriepenger avsatt", v: `${(lonnKjoring.feriepenger / 1000).toFixed(1)}k kr` },
                ].map((k) => (
                  <div
                    key={k.l}
                    style={{
                      background: C.greenXL,
                      borderRadius: 9,
                      padding: "10px 12px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: C.soft,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        marginBottom: 3,
                      }}
                    >
                      {k.l}
                    </div>
                    <div className="fr" style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>
                      {k.v}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Betalingsplan</div>
              {(
                [
                  {
                    dato: "25. mars",
                    hva: "Nettoutbetaling til 5 ansatte",
                    belop: `${(lonnKjoring.totalNetto / 1000).toFixed(1)}k kr`,
                    fra: "DNB bedriftskonto → private kontoer",
                    ok: false,
                  },
                  {
                    dato: "28. mars",
                    hva: "Skattetrekk til Skatteetaten",
                    belop: `${((lonnKjoring.totalBrutto - lonnKjoring.totalNetto) / 1000).toFixed(1)}k kr`,
                    fra: "DNB bedriftskonto → Skatteetaten (KID)",
                    ok: false,
                  },
                  {
                    dato: "15. april",
                    hva: "Arbeidsgiveravgift (termin 2)",
                    belop: `${(lonnKjoring.agAvgift / 1000).toFixed(1)}k kr`,
                    fra: "DNB bedriftskonto → Skatteetaten",
                    ok: false,
                  },
                ] as const
              ).map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 9,
                    border: `1px solid ${C.border}`,
                    background: "white",
                    marginBottom: 7,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: b.ok ? "#F0FDF4" : C.goldBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {b.ok ? "✓" : "📅"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>
                      {b.dato} — {b.hva}
                    </div>
                    <div style={{ fontSize: 10, color: C.soft }}>{b.fra}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, flexShrink: 0 }}>{b.belop}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card tw">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                Lønnskjøringshistorikk
              </span>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Brutto</th>
                  <th>Netto utbetalt</th>
                  <th>AG-avgift</th>
                  <th>Feriepenger</th>
                  <th>Utbet.dato</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {LONNKJORINGER.map((k) => (
                  <tr key={k.maaned}>
                    <td style={{ fontWeight: 600 }}>{k.maaned}</td>
                    <td>{k.totalBrutto.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.green, fontWeight: 600 }}>{k.totalNetto.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.goldDark }}>{k.agAvgift.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.sky }}>{k.feriepenger.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.soft, fontSize: 11 }}>{k.utbetalingsDato}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: k.status === "utbetalt" ? "#F0FDF4" : C.goldBg,
                          color: k.status === "utbetalt" ? "#16A34A" : C.goldDark,
                        }}
                      >
                        {k.status === "utbetalt" ? "✓ Utbetalt" : "⏳ Planlagt"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: "3px 9px",
                          background: C.softBg,
                          color: C.navyMid,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Last ned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lonnTab === "skatt" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
              borderRadius: 14,
              padding: "18px 20px",
              color: "white",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Slik fungerer skattetrekk hos EiraNova</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
              {(
                [
                  {
                    n: "1",
                    t: "Skattekort hentes",
                    txt: "Tripletex henter skattekort automatisk fra Skatteetaten via Altinn API. Trekkprosent eller tabell leses inn per ansatt.",
                    icon: "📥",
                  },
                  {
                    n: "2",
                    t: "Trekk holdes tilbake",
                    txt: "Skattetrekket trekkes fra bruttolønn og settes på skattetrekkskontoen (sperret konto i DNB) — ikke på bedriftskontoen.",
                    icon: "🔐",
                  },
                  {
                    n: "3",
                    t: "Innbetalt innen 3 dager",
                    txt: "Senest 3 virkedager etter lønnsutbetaling betales skattetrekket til Skatteetaten med KID-nummer.",
                    icon: "🏛️",
                  },
                  {
                    n: "4",
                    t: "AG-avgift 6 terminer/år",
                    txt: "Arbeidsgiveravgiften (14,1%) betales ikke månedlig — den følger 6-termins-ordningen og forfaller annenhver måned.",
                    icon: "📅",
                  },
                ] as const
              ).map((s) => (
                <div
                  key={s.n}
                  style={{
                    background: "rgba(255,255,255,.1)",
                    borderRadius: 10,
                    padding: "12px 13px",
                    border: "1px solid rgba(255,255,255,.15)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(74,188,158,.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#4ABC9E",
                        flexShrink: 0,
                      }}
                    >
                      {s.n}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>
                      {s.icon} {s.t}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)", lineHeight: 1.55 }}>{s.txt}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16 }}>
            <div className="card">
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                  Skattetrekkskonto
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div
                  style={{
                    background: C.dangerBg,
                    borderRadius: 9,
                    padding: "10px 13px",
                    marginBottom: 14,
                    border: "1px solid rgba(225,29,72,.2)",
                    fontSize: 10,
                    color: C.danger,
                    lineHeight: 1.6,
                  }}
                >
                  ⚠️ <strong>Lovpålagt:</strong> Skattetrekket skal oppbevares på en <strong>særskilt sperret konto</strong>{" "}
                  (skattetrekkskonto) eller dekkes av bankgaranti. Brudd kan medføre straff og personlig ansvar.
                </div>
                {(
                  [
                    { l: "Kontonummer", v: "1503.XX.XXXXX", note: "Opprettes i DNB — ikke satt opp ennå", ok: false as boolean | null },
                    { l: "Type", v: "Sperret skattetrekkskonto", note: "Alternativt: bankgaranti fra DNB", ok: null },
                    { l: "Saldo nå", v: "Ikke aktiv", note: "Aktiveres ved første lønnskjøring", ok: false },
                    { l: "Neste innbetaling", v: "25. mars 2026", note: "Innen 28. mars (3 virkedager)", ok: null },
                    { l: "Beløp å innbetale", v: `${(79371).toLocaleString("nb-NO")} kr`, note: "Mars skattetrekk alle ansatte", ok: null },
                  ] as const
                ).map((r) => (
                  <div
                    key={r.l}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: `1px solid ${C.border}`,
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.l}</div>
                      <div style={{ fontSize: 9, color: r.ok === false ? C.danger : C.soft }}>{r.note}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: r.ok === false ? C.danger : C.navy,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {r.v}
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    window.open("https://dnb.no", "_blank");
                  }}
                  className="btn bp"
                  style={{ width: "100%", marginTop: 12, padding: "9px 0", fontSize: 12, borderRadius: 9 }}
                >
                  Opprett skattetrekkskonto i DNB →
                </button>
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
                }}
              >
                <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                  Skattekort — status
                </span>
                <button
                  type="button"
                  onClick={() => toast("Skattekort hentet fra Altinn", "ok")}
                  style={{
                    fontSize: 10,
                    padding: "4px 10px",
                    background: C.greenBg,
                    color: C.green,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  🔄 Hent fra Altinn
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div
                  style={{
                    background: C.greenXL,
                    borderRadius: 9,
                    padding: "9px 12px",
                    fontSize: 10,
                    color: C.navyMid,
                    marginBottom: 12,
                    lineHeight: 1.55,
                  }}
                >
                  Tripletex henter skattekort automatisk via Altinn. Ansatte trenger ikke gjøre noe — skattekortet oppdateres
                  automatisk ved endringer.
                </div>
                {ANSATTE_LONN.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {a.av}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{a.navn}</div>
                      <div style={{ fontSize: 9, color: C.soft }}>
                        Trekkprosent: {a.trekkProsent}% · Hentet: jan 2026
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{a.trekkProsent}%</div>
                      <div
                        style={{
                          fontSize: 9,
                          background: "#F0FDF4",
                          color: "#16A34A",
                          padding: "1px 6px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        ✓ Aktiv
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                  Arbeidsgiveravgift — terminer 2026
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 14 }}>
                  {(
                    [
                      { termin: "Termin 1", periode: "Jan – Feb", forfall: "15. april 2026", belop: 63448, status: "kommende" as const },
                      { termin: "Termin 2", periode: "Mar – Apr", forfall: "15. juni 2026", belop: 65674, status: "fremtidig" as const },
                      { termin: "Termin 3", periode: "Mai – Jun", forfall: "15. aug 2026", belop: 65674, status: "fremtidig" as const },
                      { termin: "Termin 4", periode: "Jul – Aug", forfall: "15. okt 2026", belop: 65674, status: "fremtidig" as const },
                      { termin: "Termin 5", periode: "Sep – Okt", forfall: "15. des 2026", belop: 65674, status: "fremtidig" as const },
                      { termin: "Termin 6", periode: "Nov – Des", forfall: "15. feb 2027", belop: 65674, status: "fremtidig" as const },
                    ] as const
                  ).map((term) => (
                    <div
                      key={term.termin}
                      style={{
                        background: term.status === "kommende" ? C.goldBg : C.softBg,
                        borderRadius: 10,
                        padding: "12px 13px",
                        border: `1px solid ${term.status === "kommende" ? "rgba(196,149,106,.3)" : C.border}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: term.status === "kommende" ? C.goldDark : C.navy,
                          }}
                        >
                          {term.termin}
                        </span>
                        {term.status === "kommende" && (
                          <span
                            style={{
                              fontSize: 9,
                              background: C.goldBg,
                              color: C.goldDark,
                              padding: "1px 7px",
                              borderRadius: 50,
                              border: "1px solid rgba(196,149,106,.3)",
                              fontWeight: 700,
                            }}
                          >
                            Neste
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: C.soft, marginBottom: 4 }}>{term.periode}</div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: term.status === "kommende" ? C.goldDark : C.navy,
                          marginBottom: 2,
                        }}
                      >
                        {term.belop.toLocaleString("nb-NO")} kr
                      </div>
                      <div style={{ fontSize: 9, color: C.soft }}>Forfall: {term.forfall}</div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: C.greenXL,
                    borderRadius: 9,
                    padding: "9px 13px",
                    fontSize: 10,
                    color: C.navyMid,
                    lineHeight: 1.6,
                  }}
                >
                  💡 AG-avgift beregnes som <strong>{TARIFF_INFO.agAvgiftSats}% av all utbetalt lønn</strong> i terminen.
                  Tripletex akkumulerer beløpet automatisk og minner om forfallsdato. Betales med KID til Skatteetaten.
                </div>
              </div>
            </div>

            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                  Skattetrekk — innbetalingshistorikk
                </span>
              </div>
              <div className="tw">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Lønnsperiode</th>
                      <th>Lønnsutbetaling</th>
                      <th>Frist innbetaling</th>
                      <th>Skattetrekk</th>
                      <th>KID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        { periode: "Mars 2026", lonn: "25. mars", frist: "28. mars", belop: 79371, kid: "15030000143", status: "planlagt" as const },
                        { periode: "Feb 2026", lonn: "25. feb", frist: "28. feb", belop: 77656, kid: "15030000137", status: "betalt" as const },
                        { periode: "Jan 2026", lonn: "25. jan", frist: "28. jan", belop: 73706, kid: "15030000131", status: "betalt" as const },
                      ] as const
                    ).map((r) => (
                      <tr key={r.periode}>
                        <td style={{ fontWeight: 600 }}>{r.periode}</td>
                        <td style={{ color: C.soft, fontSize: 11 }}>{r.lonn}</td>
                        <td
                          style={{
                            color: r.status === "planlagt" ? C.gold : C.soft,
                            fontSize: 11,
                            fontWeight: r.status === "planlagt" ? 600 : 400,
                          }}
                        >
                          {r.frist}
                        </td>
                        <td style={{ fontWeight: 600, color: C.navy }}>{r.belop.toLocaleString("nb-NO")} kr</td>
                        <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{r.kid}</td>
                        <td>
                          <span
                            style={{
                              fontSize: 9,
                              padding: "2px 8px",
                              borderRadius: 50,
                              fontWeight: 600,
                              background: r.status === "betalt" ? "#F0FDF4" : C.goldBg,
                              color: r.status === "betalt" ? "#16A34A" : C.goldDark,
                            }}
                          >
                            {r.status === "betalt" ? "✓ Betalt" : "⏳ Planlagt"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {lonnTab === "tariff" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                Tariffavtale
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {(
                [
                  { l: "Avtale", v: TARIFF_INFO.avtale },
                  { l: "Sone", v: TARIFF_INFO.sone },
                  { l: "Arbeidsgiveravgift", v: `${TARIFF_INFO.agAvgiftSats}%` },
                  { l: "OTP-pensjon (minimum)", v: `${TARIFF_INFO.otpSats}% av lønn` },
                  { l: "Feriepenger", v: `${TARIFF_INFO.feriepengeSats}% av årslønn` },
                  { l: "AG-sykdomsperiode", v: `${TARIFF_INFO.sykeAGDager} dager, deretter NAV` },
                  { l: "Minstelønn sykepleier", v: `${TARIFF_INFO.minstelonn.sykepleier.toLocaleString("nb-NO")} kr/mnd` },
                  { l: "Minstelønn hjelpepleier", v: `${TARIFF_INFO.minstelonn.hjelpepleier.toLocaleString("nb-NO")} kr/mnd` },
                ] as const
              ).map((r) => (
                <div
                  key={r.l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: C.soft }}>{r.l}</span>
                  <span style={{ fontWeight: 600, color: C.navy }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                Tillegg og kompensasjoner
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {(
                [
                  { l: "Helgetillegg", v: `${TARIFF_INFO.tillegg.helgProsent}% av timelønn`, icon: "📅" },
                  { l: "Kvelstillegg (17-21)", v: `${TARIFF_INFO.tillegg.kveldKr} kr/time`, icon: "🌆" },
                  { l: "Nattillegg (21-06)", v: `${TARIFF_INFO.tillegg.nattKr} kr/time`, icon: "🌙" },
                  { l: "Overtid", v: `${TARIFF_INFO.tillegg.overtidProsent}% tillegg`, icon: "⏰" },
                  { l: "Reisegodtgjørelse", v: "4,50 kr/km (statssats)", icon: "🚗" },
                  { l: "Diett korte reiser", v: "Ikke aktuelt (hjemmebasert)", icon: "🥗" },
                ] as const
              ).map((r) => (
                <div
                  key={r.l}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.l}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                Frister og plikter
              </span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {(
                [
                  { frist: "Innen 5. i måneden", hva: "A-melding sendes til Skatteetaten", status: "auto" as const, color: C.green },
                  { frist: "Utbet. 25. hver mnd", hva: "Nettoutbetaling til ansatte", status: "planlagt" as const, color: C.sky },
                  { frist: "Innen 3 virkedager", hva: "Skattetrekk innbetalt etter utbet.", status: "auto" as const, color: C.green },
                  { frist: "15. jan og 15. jul", hwa: "Arbeidsgiveravgift (terminvis)", status: "kalender" as const, color: C.gold },
                  { frist: "15. april", hva: "AG-avgift termin 1 (jan–feb)", status: "kalender" as const, color: C.gold },
                  { frist: "31. mai", hva: "Feriepenger utbetalt", status: "kalender" as const, color: C.sky },
                ] as const
              )
                .filter((r) => "hwa" in r && Boolean((r as { hwa?: string }).hwa))
                .map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 9,
                      background: C.softBg,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: r.color }}>{r.frist}</div>
                      <div style={{ fontSize: 11, color: C.navy }}>{"hva" in r ? r.hva : ""}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 50,
                        background: `${r.color}18`,
                        color: r.color,
                        fontWeight: 600,
                      }}
                    >
                      {r.status === "auto" ? "🤖 Auto" : r.status === "planlagt" ? "⏳ Planlagt" : "📅 Kalender"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {lonnTab === "amelding" && (
        <div>
          <div
            style={{
              background: C.greenXL,
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              border: `1px solid ${C.border}`,
              fontSize: 11,
              color: C.navyMid,
              lineHeight: 1.6,
            }}
          >
            📤 <strong>A-melding</strong> sendes automatisk via Tripletex til Altinn innen 5. i måneden. Inneholder lønn,
            skattetrekk, arbeidsgiveravgift og feriepenger for alle ansatte. EiraNova har plikt til å sende A-melding fra første
            ansatt.
          </div>
          <div className="card tw">
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
                A-meldingshistorikk
              </span>
              <button
                type="button"
                onClick={() => toast("A-melding sendt til Altinn", "ok")}
                className="btn bp"
                style={{ fontSize: 11, padding: "6px 14px" }}
              >
                Send A-melding nå
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Sendt</th>
                  <th>Ansatte</th>
                  <th>Bruttolønn</th>
                  <th>Skattetrekk</th>
                  <th>Altinn ref.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { periode: "Mars 2026", sendt: "—", ansatte: 5, brutto: 232800, trekk: 79371, ref: "—", status: "planlagt" as const },
                    {
                      periode: "Feb 2026",
                      sendt: "2026-03-04",
                      ansatte: 5,
                      brutto: 228400,
                      trekk: 77656,
                      ref: "A-2026-02-EN0044",
                      status: "godkjent" as const,
                    },
                    {
                      periode: "Jan 2026",
                      sendt: "2026-02-03",
                      ansatte: 5,
                      brutto: 215900,
                      trekk: 73706,
                      ref: "A-2026-01-EN0021",
                      status: "godkjent" as const,
                    },
                  ] as const
                ).map((r) => (
                  <tr key={r.periode}>
                    <td style={{ fontWeight: 600 }}>{r.periode}</td>
                    <td style={{ fontSize: 11, color: C.soft }}>{r.sendt}</td>
                    <td>{r.ansatte}</td>
                    <td>{r.brutto.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.danger }}>{r.trekk.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{r.ref}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: r.status === "godkjent" ? "#F0FDF4" : C.goldBg,
                          color: r.status === "godkjent" ? "#16A34A" : C.goldDark,
                        }}
                      >
                        {r.status === "godkjent" ? "✓ Godkjent av Altinn" : "⏳ Planlagt"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
