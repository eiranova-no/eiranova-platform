"use client";

import { BEMANNING_BYRAER, INIT_VIKARER } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";
import { useAdminToast } from "@/components/admin/useAdminToast";

const C = colors;

type VikarRad = (typeof INIT_VIKARER)[number];
type ByraRad = (typeof BEMANNING_BYRAER)[number];

export function VikarPanel() {
  const { toast, ToastContainer } = useAdminToast();
  const [sub, setSub] = useState<"oversikt" | "byraer" | "vaktvakt">("oversikt");
  const [vikarer, setVikarer] = useState<VikarRad[]>(() => [...INIT_VIKARER]);
  const [valgtVikar, setValgtVikar] = useState<VikarRad | null>(null);
  const [, setNyModal] = useState(false);
  const [byraer, setByraer] = useState<ByraRad[]>(() => [...BEMANNING_BYRAER]);
  const [, setNyByraModal] = useState<boolean | null>(null);

  const aktive = vikarer.filter((v) => v.status === "aktiv");
  const ventende = vikarer.filter((v) => v.status === "venter_godkjenning");

  function StatusBadge({ status }: { status: string }) {
    const cfg: Record<string, { bg: string; c: string; l: string }> = {
      aktiv: { bg: "#F0FDF4", c: "#16A34A", l: "✓ Aktiv" },
      venter_godkjenning: { bg: "#FFF3E0", c: "#E65100", l: "⏳ Venter godkjenning" },
      inaktiv: { bg: C.softBg, c: C.soft, l: "Inaktiv" },
    };
    const s = cfg[status] ?? cfg.inaktiv;
    return (
      <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 50, fontWeight: 600, background: s.bg, color: s.c }}>{s.l}</span>
    );
  }

  return (
    <div>
      <ToastContainer />
      {valgtVikar && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 18,
              width: "100%",
              maxWidth: 540,
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
                  {valgtVikar.av}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>{valgtVikar.navn}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                    {valgtVikar.tittel} · HPR: {valgtVikar.hpr}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValgtVikar(null)}
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
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { l: "Type", v: valgtVikar.enk ? `ENK — ${valgtVikar.enkOrg}` : "Midlertidig ansatt" },
                  { l: "Telefon", v: valgtVikar.telefon },
                  { l: "E-post", v: valgtVikar.epost },
                  { l: "Kontonr (utbetaling)", v: valgtVikar.kontonr || "Ikke registrert" },
                  { l: "Varsling", v: valgtVikar.varsel === "push" ? "📱 Push-varsel" : "📱 SMS" },
                  { l: "Responstid", v: valgtVikar.responstid },
                  {
                    l: "Gjennomsnitt",
                    v: valgtVikar.rating > 0 ? `⭐ ${valgtVikar.rating} (${valgtVikar.oppdrag} oppdrag)` : "Ingen oppdrag ennå",
                  },
                  { l: "Godkjent", v: valgtVikar.godkjent ? `✓ ${valgtVikar.godkjentDato}` : "⏳ Venter" },
                ].map((r) => (
                  <div key={r.l} style={{ background: C.greenXL, borderRadius: 8, padding: "9px 11px" }}>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: C.soft,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        marginBottom: 2,
                      }}
                    >
                      {r.l}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 7 }}>Godkjente tjenester</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {valgtVikar.tjenester.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        background: C.greenBg,
                        color: C.green,
                        padding: "3px 10px",
                        borderRadius: 50,
                        border: `0.5px solid ${C.border}`,
                        fontWeight: 500,
                      }}
                    >
                      {t.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 7 }}>Dekningsområde</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {valgtVikar.omrade.map((o) => (
                    <span
                      key={o}
                      style={{ fontSize: 10, background: C.softBg, color: C.navyMid, padding: "3px 10px", borderRadius: 50, fontWeight: 500 }}
                    >
                      📍 {o}
                    </span>
                  ))}
                </div>
              </div>
              {valgtVikar.evaluering && (
                <div
                  style={{
                    marginBottom: 16,
                    background: C.greenXL,
                    borderRadius: 9,
                    padding: "10px 13px",
                    border: `1px solid ${C.border}`,
                    fontSize: 11,
                    color: C.navyMid,
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  💬 &quot;{valgtVikar.evaluering}&quot;
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                {!valgtVikar.godkjent && (
                  <button
                    type="button"
                    onClick={() => {
                      setVikarer((p) =>
                        p.map((v) =>
                          v.id === valgtVikar.id
                            ? ({
                                ...v,
                                godkjent: true,
                                godkjentDato: new Date().toISOString().slice(0, 10),
                                status: "aktiv",
                              } as VikarRad)
                            : v,
                        ),
                      );
                      setValgtVikar(null);
                    }}
                    className="btn bp"
                    style={{ flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 9 }}
                  >
                    ✓ Godkjenn vikar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setValgtVikar(null)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    fontSize: 12,
                    borderRadius: 9,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Lukk
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { l: "Aktive vikarer", v: aktive.length, icon: "🤝", c: C.green },
          { l: "Venter godkjenning", v: ventende.length, icon: "⏳", c: ventende.length > 0 ? C.gold : C.soft },
          { l: "Tilgjengelig nå", v: vikarer.filter((v) => v.tilgjengelig && v.status === "aktiv").length, icon: "✅", c: C.green },
          { l: "Byrå-avtaler aktive", v: byraer.filter((b) => b.aktiv).length, icon: "🏢", c: C.sky },
          {
            l: "Snitt rating",
            v:
              aktive.filter((v) => v.rating > 0).length > 0
                ? (aktive.filter((v) => v.rating > 0).reduce((s, v) => s + v.rating, 0) / aktive.filter((v) => v.rating > 0).length).toFixed(1) +
                  "⭐"
                : "–",
            icon: "⭐",
            c: C.gold,
          },
        ].map((k) => (
          <div key={k.l} className="card cp">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.soft, textTransform: "uppercase", letterSpacing: 0.4 }}>{k.l}</span>
              <span>{k.icon}</span>
            </div>
            <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: k.c }}>
              {k.v}
            </div>
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
            ["oversikt", "👥 Vikarer"],
            ["byraer", "🏢 Bemanningsbyrå"],
            ["vaktvakt", "⚡ Vaktvakt-flyt"],
          ] as const
        ).map(([t, l]) => (
          <button
            key={t}
            type="button"
            onClick={() => setSub(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: sub === t ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: sub === t ? C.greenBg : "transparent",
              color: sub === t ? C.green : C.soft,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {sub === "oversikt" && (
        <div>
          {ventende.length > 0 && (
            <div
              style={{
                background: "#FFF3E0",
                border: "1px solid #FFD0A0",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 20 }}>⏳</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#E65100" }}>
                  {ventende.length} vikar{ventende.length > 1 ? "er" : ""} venter godkjenning
                </div>
                <div style={{ fontSize: 10, color: C.soft }}>
                  {ventende.map((v) => v.navn).join(", ")} — klikk for å gjennomgå og godkjenne
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => {
                setNyModal(true);
                toast("Vikar-registreringsflyt kommer — send invitasjon via e-post", "warn");
              }}
              className="btn bp"
              style={{ fontSize: 11, padding: "7px 16px" }}
            >
              + Legg til vikar
            </button>
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Type</th>
                  <th>Tjenester</th>
                  <th>Område</th>
                  <th>Tilgjengelig</th>
                  <th>Rating</th>
                  <th>Responstid</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vikarer.map((v) => (
                  <tr
                    key={v.id}
                    style={{ cursor: "pointer", background: v.status === "venter_godkjenning" ? "#FFFDF5" : "white" }}
                    onClick={() => setValgtVikar(v)}
                  >
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
                            fontSize: 10,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {v.av}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{v.navn}</div>
                          <div style={{ fontSize: 9, color: C.soft }}>
                            {v.tittel} · HPR {v.hpr}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 7px",
                          borderRadius: 50,
                          background: v.enk ? C.greenBg : C.skyBg,
                          color: v.enk ? C.green : C.sky,
                          fontWeight: 600,
                        }}
                      >
                        {v.enk ? "ENK" : "Midl."}
                      </span>
                    </td>
                    <td style={{ fontSize: 10, color: C.soft }}>{v.tjenester.length} tjenester</td>
                    <td style={{ fontSize: 10, color: C.soft }}>{v.omrade.join(", ")}</td>
                    <td>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: v.tilgjengelig && v.status === "aktiv" ? "#16A34A" : "#D1D5DB",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                    <td style={{ fontSize: 11, fontWeight: 600, color: v.rating > 0 ? C.navy : C.soft }}>
                      {v.rating > 0 ? `⭐ ${v.rating}` : "–"}
                    </td>
                    <td style={{ fontSize: 10, color: C.soft }}>{v.responstid}</td>
                    <td>
                      <StatusBadge status={v.status} />
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
                          setValgtVikar(v);
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

      {sub === "byraer" && (
        <div>
          <div
            style={{
              background: C.skyBg,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 11,
              color: "#1e40af",
              lineHeight: 1.6,
              border: "1px solid rgba(37,99,235,.15)",
            }}
          >
            🏢 <strong>Vaktvakt-prioritet:</strong> EiraNova forsøker alltid egne vikarer først. Bemanningsbyrå aktiveres automatisk hvis ingen
            egne vikarer responderer innen konfigurert tid. Se{" "}
            <button
              type="button"
              onClick={() => setSub("vaktvakt")}
              style={{
                background: "none",
                border: "none",
                color: C.sky,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                padding: 0,
                fontSize: 11,
              }}
            >
              Vaktvakt-flyt →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginBottom: 16 }}>
            {byraer.map((b) => (
              <div key={b.id} className="card" style={{ opacity: b.aktiv ? 1 : 0.7 }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: b.aktiv ? C.greenBg : C.softBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: b.aktiv ? C.green : C.soft,
                      flexShrink: 0,
                    }}
                  >
                    {b.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{b.navn}</div>
                    <div style={{ fontSize: 10, color: C.soft }}>{b.kontakt}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 50,
                        fontWeight: 600,
                        background: b.aktiv ? "#F0FDF4" : C.softBg,
                        color: b.aktiv ? "#16A34A" : C.soft,
                      }}
                    >
                      {b.aktiv ? "✓ Aktiv avtale" : "Ingen avtale"}
                    </span>
                    {b.api && (
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 7px",
                          borderRadius: 50,
                          background: b.apiStatus === "aktiv" ? C.greenBg : C.goldBg,
                          color: b.apiStatus === "aktiv" ? C.green : C.goldDark,
                          fontWeight: 600,
                        }}
                      >
                        {b.apiStatus === "aktiv" ? "🔌 API aktiv" : "🔌 API ikke satt opp"}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {[
                    { l: "Tilgjengelighet", v: b.tilgjengelighet },
                    { l: "Responstid", v: b.responstid },
                    { l: "Timepris sykepleier", v: `${b.timepris.sykepleier} kr/t` },
                    { l: "Timepris hjelpepleier", v: `${b.timepris.hjelpepleier} kr/t` },
                    { l: "Fakturering", v: b.faktura },
                    { l: "Avtale", v: b.avtale || "—" },
                  ].map((r) => (
                    <div
                      key={r.l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: `1px solid ${C.border}`,
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: C.soft }}>{r.l}</span>
                      <span style={{ fontWeight: 600, color: C.navy }}>{r.v}</span>
                    </div>
                  ))}
                  {b.api && b.apiUrl && (
                    <div
                      style={{
                        marginTop: 10,
                        background: C.softBg,
                        borderRadius: 7,
                        padding: "6px 10px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: C.navyMid,
                      }}
                    >
                      {b.apiUrl}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setByraer((p) => p.map((x) => (x.id === b.id ? { ...x, aktiv: !x.aktiv } : x)))}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        fontSize: 11,
                        borderRadius: 8,
                        background: b.aktiv ? C.dangerBg : C.greenBg,
                        color: b.aktiv ? C.danger : C.green,
                        border: `1px solid ${b.aktiv ? "rgba(225,29,72,.2)" : C.border}`,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {b.aktiv ? "Deaktiver avtale" : "Aktiver avtale"}
                    </button>
                    {b.api && !b.aktiv && (
                      <button
                        type="button"
                        onClick={() => toast(`API-oppsett for ${b.navn} — krever API-nøkkel fra byrået`, "warn")}
                        style={{
                          flex: 1,
                          padding: "7px 0",
                          fontSize: 11,
                          borderRadius: 8,
                          background: C.skyBg,
                          color: C.sky,
                          border: `1px solid rgba(37,99,235,.2)`,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontWeight: 600,
                        }}
                      >
                        🔌 Sett opp API
                      </button>
                    )}
                    {b.api && b.apiStatus === "aktiv" && (
                      <button
                        type="button"
                        onClick={() => toast(`${b.navn}: tilkobling OK ✓`, "ok")}
                        style={{
                          flex: 1,
                          padding: "7px 0",
                          fontSize: 11,
                          borderRadius: 8,
                          background: C.greenBg,
                          color: C.green,
                          border: `1px solid ${C.border}`,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Test tilkobling
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setNyByraModal(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setNyByraModal(true);
                }
              }}
              style={{
                border: `2px dashed ${C.border}`,
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                minHeight: 200,
                background: "white",
                transition: "border-color .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.green;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: C.greenBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                +
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Legg til bemanningsbyrå</div>
            </div>
          </div>
        </div>
      )}

      {sub === "vaktvakt" && (
        <div>
          <div
            style={{
              background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 20,
              color: "white",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚡ Automatisk vaktvakt-flyt</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>
              Når et oppdrag ikke har tildelt sykepleier, forsøker systemet automatisk å fylle plassen i prioritert rekkefølge.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
            {[
              {
                steg: 1,
                tittel: "Oppdrag uten tildelt sykepleier",
                detalj: "Enten nytt oppdrag eller sykepleier meldt syk",
                icon: "📋",
                tid: "0 min",
                action: "Automatisk trigger",
                color: C.navy,
              },
              {
                steg: 2,
                tittel: "Varsle egne tilkallingsvikarer",
                detalj: `Push-varsel til ${aktive.length} aktive vikarer i riktig område. Inkl. tjenestetype og tidspunkt.`,
                icon: "📱",
                tid: "0–30 min",
                action: "Første tilgjengelige vikar aksepterer",
                color: C.green,
              },
              {
                steg: 3,
                tittel: "Ingen respons → API-forespørsel til byrå",
                detalj: `Automatisk forespørsel til ${byraer.filter((b) => b.aktiv && b.api).map((b) => b.navn).join(", ") || "aktivt byrå med API"}. Inkl. HPR-krav og tjenestebeskrivelse.`,
                icon: "🏢",
                tid: "30–90 min",
                action: "Byrå bekrefter tilgjengelig vikar",
                color: C.sky,
              },
              {
                steg: 4,
                tittel: "Ingen API-byrå → Manuell bestilling",
                detalj: "Admin varsles. Ring øvrige byrå manuelt. Registrer vikaren manuelt i systemet.",
                icon: "📞",
                tid: "90+ min",
                action: "Manuell tildeling av admin",
                color: C.gold,
              },
              {
                steg: 5,
                tittel: "Kunde varsles ved tildeling",
                detalj: "Automatisk SMS/push til kunde: ny sykepleier bekreftet. Navn og tidspunkt.",
                icon: "✅",
                tid: "Ved tildeling",
                action: "Kunden informert",
                color: "#16A34A",
              },
            ].map((s, i) => (
              <div key={s.steg} style={{ display: "flex", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: s.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                      border: `3px solid ${s.color}44`,
                    }}
                  >
                    {s.icon}
                  </div>
                  {i < 4 && <div style={{ width: 2, flex: 1, background: C.border, margin: "4px 0", minHeight: 20 }} />}
                </div>
                <div style={{ flex: 1, padding: "2px 0 20px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>
                      Steg {s.steg}: {s.tittel}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        background: `${s.color}18`,
                        color: s.color,
                        padding: "1px 8px",
                        borderRadius: 50,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {s.tid}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.55, marginBottom: 4 }}>{s.detalj}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.color }}>→ {s.action}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                ⚙️ Vaktvakt-innstillinger
              </span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                {[
                  { l: "Ventetid før byrå-API (min)", v: "30", hint: "Tid egne vikarer har til å svare" },
                  { l: "Ventetid før manuell varsling (min)", v: "90", hint: "Før admin-varsling" },
                  { l: "Varslingskanal", v: "Push + SMS", hint: "Egne vikarer" },
                  { l: "Automatisk byrå-API", v: "Ja — Manpower Health", hint: "Ved manglende respons" },
                ].map((r) => (
                  <div key={r.l}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>{r.l}</label>
                    <input
                      defaultValue={r.v}
                      style={{
                        width: "100%",
                        padding: "8px 11px",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 12,
                        fontFamily: "inherit",
                        background: C.greenXL,
                      }}
                    />
                    <div style={{ fontSize: 9, color: C.soft, marginTop: 2 }}>{r.hint}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => toast("Vaktvakt-innstillinger lagret")}
                className="btn bp"
                style={{ marginTop: 14, padding: "8px 20px", fontSize: 12, borderRadius: 9 }}
              >
                Lagre vaktvakt-innstillinger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
