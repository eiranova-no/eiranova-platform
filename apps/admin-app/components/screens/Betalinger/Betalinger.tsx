"use client";

import { KREDITERINGER, STRIPE_P, VIPPS_P, WH } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { Bdg } from "@/components/admin/Bdg";
import { KrediterPrivatModal } from "@/components/admin/KrediterPrivatModal";
import { KreditnotaB2BModal } from "@/components/admin/KreditnotaB2BModal";
import { useAdminToast } from "@/components/admin/useAdminToast";

const C = colors;

type BetalingerTab = "oversikt" | "vipps" | "stripe" | "krediteringer" | "aktivitet";

export function Betalinger() {
  const { toast, ToastContainer } = useAdminToast();
  const [tab, setTab] = useState<BetalingerTab>("oversikt");
  const [showKrediterPrivat, setShowKrediterPrivat] = useState(false);
  const [showKreditnotaB2B, setShowKreditnotaB2B] = useState(false);

  const tv = VIPPS_P.reduce((s, p) => s + p.amount, 0);
  const ts = STRIPE_P.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="fu">
      <ToastContainer />
      {showKrediterPrivat && (
        <KrediterPrivatModal
          onClose={() => setShowKrediterPrivat(false)}
          onSave={() => {
            toast("Kreditering registrert (mock)", "ok");
          }}
        />
      )}
      {showKreditnotaB2B && (
        <KreditnotaB2BModal
          onClose={() => setShowKreditnotaB2B(false)}
          onSave={() => toast("Kreditnota registrert (mock)", "ok")}
        />
      )}
      <div className="g4" style={{ marginBottom: 16 }}>
        {[
          { label: "Vipps (mtd)", value: `${(tv / 1000).toFixed(1)}k kr`, icon: "💜", sub: "D+1 til DNB" },
          { label: "Stripe (mtd)", value: `${(ts / 1000).toFixed(1)}k kr`, icon: "💳", sub: "T+2 til DNB" },
          { label: "B2B utestående", value: "33 240 kr", icon: "📄", sub: "2 forfalt" },
          { label: "Siste hendelse", value: "OK", icon: "🔔", sub: "10:31 i dag" },
        ].map((k) => (
          <div key={k.label} className="card cp">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
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
                {k.label}
              </span>
              <span style={{ fontSize: 17 }}>{k.icon}</span>
            </div>
            <div className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 9, color: C.soft }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: 10,
          padding: 3,
          marginBottom: 14,
          border: `1px solid ${C.border}`,
          width: "fit-content",
        }}
      >
        {(["oversikt", "vipps", "stripe", "krediteringer", "aktivitet"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: tab === t ? C.greenBg : "transparent",
              color: tab === t ? C.green : C.soft,
              fontFamily: "inherit",
            }}
          >
            {t === "vipps"
              ? "💜 Vipps"
              : t === "stripe"
                ? "💳 Stripe"
                : t === "aktivitet"
                  ? "📋 Aktivitetslogg"
                  : t === "krediteringer"
                    ? "↩️ Krediteringer"
                    : "📊 Oversikt"}
          </button>
        ))}
      </div>
      {tab === "oversikt" && (
        <div className="g2 g2m1">
          <div className="card cp">
            <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
              Betalingsflyt
            </div>
            {[
              { from: "Vipps MobilePay", to: "DNB konto", timing: "D+1 virkedag", icon: "💜" },
              { from: "Stripe (Visa/MC)", to: "DNB konto", timing: "T+2 virkedager", icon: "💳" },
              { from: "EHF/KID-betaling", to: "Tripletex → DNB", timing: "14–30 dager netto", icon: "📄" },
            ].map((f) => (
              <div
                key={f.from}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: f.icon === "💜" ? "#FFF0EB" : f.icon === "💳" ? C.skyBg : C.goldBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{f.from}</div>
                  <div style={{ fontSize: 10, color: C.soft }}>
                    → {f.to} · {f.timing}
                  </div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
              </div>
            ))}
            <div style={{ marginTop: 10, background: C.greenBg, borderRadius: 8, padding: "8px 10px", fontSize: 10, color: C.greenDark }}>
              🏦 Alle midler eies av EiraNova AS fra betaling. Ingen mellomkonto.
            </div>
          </div>
          <div className="card">
            <div
              style={{
                padding: "12px 14px",
                borderBottom: `1px solid ${C.border}`,
                fontFamily: "'Fraunces',serif",
                fontSize: 14,
                fontWeight: 600,
                color: C.navy,
              }}
            >
              Aktivitetslogg
            </div>
            {WH.map((w, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 14px",
                  borderBottom: i < WH.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: w.status === "ok" ? "#16A34A" : C.danger,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.navy,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {w.event}
                  </div>
                  <div style={{ fontSize: 9, color: C.soft }}>
                    {w.ref} · {w.time}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 7px",
                    borderRadius: 50,
                    background: w.method === "vipps" ? "#FFF0EB" : C.skyBg,
                    color: w.method === "vipps" ? C.vipps : C.sky,
                    fontWeight: 600,
                  }}
                >
                  {w.method}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "vipps" && (
        <div>
          <div
            style={{
              background: "#FFF5F1",
              border: "1px solid rgba(255,91,36,.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 11,
              color: "#7A3020",
              lineHeight: 1.5,
            }}
          >
            💜 <strong>Vipps MobilePay ePayment API</strong> — Daglig oppgjør D+1 til EiraNova DNB-konto. Konfigurasjon i Vipps Merchant
            Portal.
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Referanse</th>
                  <th>Dato</th>
                  <th>Beløp</th>
                  <th>Ordre</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {VIPPS_P.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{p.id}</td>
                    <td>{p.date}</td>
                    <td style={{ fontWeight: 600 }}>{p.amount.toLocaleString("nb-NO")} kr</td>
                    <td>{p.orders} oppdrag</td>
                    <td>
                      <Bdg status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "stripe" && (
        <div>
          <div
            style={{
              background: C.skyBg,
              border: `1px solid rgba(37,99,235,.15)`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 11,
              color: "#1e40af",
              lineHeight: 1.5,
            }}
          >
            💳 <strong>Stripe Automatic Payouts</strong> — T+2 til EiraNova DNB. <code>setup_future_usage:&apos;off_session&apos;</code> lagrer
            kort for gjentakende betaling.
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Initiert</th>
                  <th>Beløp</th>
                  <th>Ankommer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STRIPE_P.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{p.id}</td>
                    <td>{p.date}</td>
                    <td style={{ fontWeight: 600 }}>{p.amount.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: C.soft }}>{p.arrival}</td>
                    <td>
                      <Bdg status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "krediteringer" && (
        <div>
          <div
            style={{
              background: "#F5F3FF",
              border: "1px solid #C4B5FD",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 11,
              color: "#5B21B6",
              lineHeight: 1.55,
            }}
          >
            <strong>Best practice:</strong> Privatkunder (Vipps/kort) → direkte refusjon via betalings-API. B2B → kreditnota sendes via EHF/PDF
            og trekkes fra neste faktura eller utbetales. Alle krediteringer krever årsak og godkjenning.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
            {[
              {
                label: "Totalt kreditert (mtd)",
                value: `${KREDITERINGER.reduce((s, k) => s + k.belop, 0).toLocaleString("nb-NO")} kr`,
                icon: "↩️",
                color: C.soft,
              },
              { label: "B2C refusjoner", value: `${KREDITERINGER.filter((k) => k.type === "b2c").length} stk`, icon: "💳", color: C.sky },
              { label: "B2B kreditnotaer", value: `${KREDITERINGER.filter((k) => k.type === "b2b").length} stk`, icon: "📄", color: C.gold },
            ].map((k) => (
              <div key={k.label} className="card cp">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.soft, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {k.label}
                  </span>
                  <span>{k.icon}</span>
                </div>
                <div className="fr" style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>
                  {k.value}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowKrediterPrivat(true)} className="btn bp" style={{ fontSize: 12, padding: "8px 18px", borderRadius: 9 }}>
              + Krediter privatkunde (Vipps/kort)
            </button>
            <button
              type="button"
              onClick={() => setShowKreditnotaB2B(true)}
              style={{
                fontSize: 12,
                padding: "8px 18px",
                borderRadius: 9,
                background: "white",
                color: C.navy,
                border: `1.5px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              + Utstedd B2B kreditnota
            </button>
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kunde</th>
                  <th>Oppdrag</th>
                  <th>Beløp</th>
                  <th>Årsak</th>
                  <th>Metode</th>
                  <th>Godkjent av</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {KREDITERINGER.map((k) => (
                  <tr key={k.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{k.id}</td>
                    <td style={{ fontWeight: 600 }}>{k.kunde}</td>
                    <td style={{ fontSize: 11, color: C.soft }}>{k.oppdrag}</td>
                    <td style={{ fontWeight: 700, color: C.navy }}>{k.belop.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontSize: 10, color: C.soft, maxWidth: 180 }}>{k.arsak}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: k.method === "vipps" ? "#FFF0EB" : k.method === "stripe" ? C.skyBg : "#FFF3E0",
                          color: k.method === "vipps" ? C.vipps : k.method === "stripe" ? C.sky : "#E65100",
                        }}
                      >
                        {k.method === "vipps" ? "💜 Vipps" : k.method === "stripe" ? "💳 Stripe" : "📄 Kreditnota"}
                      </span>
                    </td>
                    <td style={{ fontSize: 11 }}>{k.godkjentAv}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: k.status === "refundert" ? "#F0FDF4" : "#FFF3E0",
                          color: k.status === "refundert" ? "#16A34A" : "#E65100",
                        }}
                      >
                        {k.status === "refundert" ? "✓ Refundert" : "📤 Sendt"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: "3px 10px",
                          background: C.softBg,
                          color: C.navyMid,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {k.kreditnotaNr ? "Last ned PDF" : "Kvittering"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(37,99,235,.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 6 }}>💳 B2C — Direkte refusjon</div>
              <div style={{ fontSize: 11, color: "#1e40af", lineHeight: 1.6 }}>
                Vipps: Refunderes via <code>ePayments API</code> — tilbake på kundens Vipps innen 1-3 dager.
                <br />
                Stripe: Refunderes via <code>refunds.create</code> — tilbake på kort innen 5-10 virkedager.
                <br />
                <strong>Ingen faktura utstedes</strong> — kreditering registreres i aktivitetslogg.
              </div>
            </div>
            <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "12px 14px", border: "1px solid #FDE68A" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>📄 B2B — Kreditnota</div>
              <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.6 }}>
                Kreditnota sendes via <strong>EHF/PEPPOL</strong> til kommuner, PDF til andre.
                <br />
                Trekkes automatisk fra neste faktura, eller utbetales direkte ved avtale.
                <br />
                <strong>Kreditnota nr. følger faktura-serien</strong> (KN-2026-XXX).
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === "aktivitet" && (
        <div className="card">
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: C.navy }}>Aktivitetslogg</span>
            <div style={{ display: "flex", gap: 4 }}>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 50, background: "#F0FDF4", color: "#16A34A", fontWeight: 600 }}>
                3 OK
              </span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 50, background: C.dangerBg, color: C.danger, fontWeight: 600 }}>
                1 Feil
              </span>
            </div>
          </div>
          {WH.map((w, i) => (
            <div
              key={i}
              style={{
                padding: "11px 14px",
                borderBottom: i < WH.length - 1 ? `1px solid ${C.border}` : "none",
                background: w.status === "error" ? "#FFFBFB" : "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: w.status === "ok" ? "#16A34A" : C.danger,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, color: C.navy, fontFamily: "monospace" }}>{w.event}</span>
                <span style={{ marginLeft: "auto", fontSize: 9, color: C.soft }}>{w.time}</span>
              </div>
              <div style={{ fontSize: 10, color: C.soft, marginLeft: 16 }}>
                {w.ref} · {w.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
