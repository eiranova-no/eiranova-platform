"use client";

import { B2B_C, B2B_INV, INIT_AVTALEMODELLER, MOCK_B2B_HENVENDELSER } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Bdg } from "@/components/admin/Bdg";
import { ModalPortal } from "@/components/admin/ModalPortal";
import { useAdminToast } from "@/components/admin/useAdminToast";
import { useAdminDrawer } from "@/lib/admin/AdminDrawerContext";

const C = colors;

type B2BTab = "kunder" | "fakturaer" | "avtalemodeller";
type AvtaleModell = (typeof INIT_AVTALEMODELLER)[number];

type AvtaleFormState = {
  id: string;
  label: string;
  ikon: string;
  farge: string;
  beskrivelse: string;
  fakturaType: string;
  fakturadag: number | null;
  betalingsfrist: number;
  felt: AvtaleModell["felt"];
  aktiv: boolean;
  systemModell: boolean;
};

const defaultAvtaleForm = (): AvtaleFormState => ({
  id: "",
  label: "",
  ikon: "📄",
  farge: C.green,
  beskrivelse: "",
  fakturaType: "maanedlig",
  fakturadag: 1,
  betalingsfrist: 14,
  felt: [],
  aktiv: true,
  systemModell: false,
});

function avtaleToForm(a: AvtaleModell): AvtaleFormState {
  return {
    id: a.id,
    label: a.label,
    ikon: a.ikon,
    farge: a.farge,
    beskrivelse: a.beskrivelse,
    fakturaType: a.fakturaType,
    fakturadag: a.fakturadag ?? null,
    betalingsfrist: a.betalingsfrist,
    felt: a.felt,
    aktiv: a.aktiv,
    systemModell: a.systemModell,
  };
}

export function B2B() {
  const router = useRouter();
  const { openDrawer } = useAdminDrawer();
  const { toast, ToastContainer } = useAdminToast();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<B2BTab>("kunder");
  const [avtalemodeller, setAvtalemodeller] = useState<AvtaleModell[]>(() => [...INIT_AVTALEMODELLER]);
  const [avtaleModal, setAvtaleModal] = useState<"ny" | AvtaleModell | null>(null);
  const [avtaleForm, setAvtaleForm] = useState<AvtaleFormState>(defaultAvtaleForm);

  const prisLabel = (p: string) => {
    const m = avtalemodeller.find((a) => a.id === p);
    return m ? `${m.ikon} ${m.label}` : p;
  };
  const prisColor = (p: string) => {
    const m = avtalemodeller.find((a) => a.id === p);
    return m ? { bg: `${m.farge}18`, c: m.farge } : { bg: C.softBg, c: C.soft };
  };
  const tjenesteNavn = (t: string) =>
    (
      {
        morgensstell: "Morgensstell",
        praktisk: "Praktisk bistand",
        ringetilsyn: "Ringetilsyn",
        besok: "Besøksvenn",
        transport: "Transport",
        avlastning: "Avlastning",
      } as Record<string, string>
    )[t] ?? t;

  const kopierTelefon = (raw: string) => {
    const num = String(raw ?? "").replace(/\s/g, "");
    const done = () => toast("Telefonnummer kopiert", "ok");
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(num).then(done).catch(() => toast("Kunne ikke kopiere — marker nummeret manuelt", "warn"));
    } else {
      done();
    }
  };

  const handleOpprettKoordinator = (email: string) => {
    router.push(`/ansatte?prefillEmail=${encodeURIComponent(email)}`);
  };

  return (
    <div className="fu">
      <ToastContainer />
      <div
        className="card"
        style={{
          marginBottom: 16,
          padding: "14px 16px",
          border: `1px solid ${C.border}`,
          background: "linear-gradient(135deg,#F3FAF7,#E8F5F0)",
        }}
      >
        <div className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
          Nye henvendelser
        </div>
        <div style={{ fontSize: 10, color: C.soft, marginBottom: 12, lineHeight: 1.5 }}>
          Fra kontaktskjemaet på kunde-landing (mock). Lise varsles på e-post når dette er koblet til Resend.
        </div>
        {MOCK_B2B_HENVENDELSER.map((h) => (
          <div key={h.id} style={{ background: "white", borderRadius: 10, padding: "12px 13px", marginBottom: 10, border: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
              {h.navn} · {h.organisasjon}
            </div>
            <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.55, marginBottom: 4 }}>
              <span style={{ color: C.navyMid }}>{h.epost}</span>
              {" · "}
              <span style={{ fontWeight: 500, color: C.navy }}>{h.telefon}</span>
              {" · "}
              <span>ca. {h.antallBrukere} brukere</span>
            </div>
            <div style={{ fontSize: 9, color: C.soft, marginBottom: 10 }}>Mottatt {h.tidspunkt}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => kopierTelefon(h.telefon)} className="btn bp" style={{ fontSize: 10, padding: "6px 12px", borderRadius: 8 }}>
                Ring nå
              </button>
              <button
                type="button"
                onClick={() => handleOpprettKoordinator(h.epost)}
                className="btn"
                style={{
                  fontSize: 10,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "white",
                  color: C.navy,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                Opprett koordinator
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="g3" style={{ marginBottom: 16 }}>
        {[
          ["3", "B2B-kunder"],
          ["33 240 kr", "Utestående"],
          ["6", "Tilknyttede brukere"],
        ].map(([v, l]) => (
          <div key={l} className="card cp" style={{ textAlign: "center" }}>
            <div className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy }}>
              {v}
            </div>
            <div style={{ fontSize: 9, color: C.soft }}>{l}</div>
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
        {(
          [
            ["kunder", "👥 Kunder & brukere"],
            ["fakturaer", "🧾 Fakturaer"],
            ["avtalemodeller", "📋 Avtalemodeller"],
          ] as const
        ).map(([t, l]) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: activeTab === t ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: activeTab === t ? C.greenBg : "transparent",
              color: activeTab === t ? C.green : C.soft,
              fontFamily: "inherit",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {activeTab === "kunder" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
              B2B-kunder
            </div>
            <button type="button" onClick={() => openDrawer("b2b")} className="btn bp" style={{ fontSize: 11, padding: "7px 14px" }}>
              + Legg til kunde
            </button>
          </div>

          {B2B_C.map((c) => {
            const isOpen = expanded === c.id;
            const pc = prisColor(c.prismodell);
            return (
              <div key={c.id} className="card" style={{ marginBottom: 10 }}>
                <div role="presentation" onClick={() => setExpanded(isOpen ? null : c.id)} style={{ padding: "13px 14px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{c.name}</span>
                        <span style={{ fontSize: 9, background: C.softBg, borderRadius: 50, padding: "1px 7px", color: C.soft }}>{c.type}</span>
                        {c.peppol && (
                          <span style={{ fontSize: 9, background: C.greenBg, borderRadius: 50, padding: "1px 7px", color: C.green }}>
                            EHF/PEPPOL
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, background: pc.bg, color: pc.c, borderRadius: 50, padding: "2px 9px", fontWeight: 600 }}>
                        {prisLabel(c.prismodell)}
                      </span>
                      <div style={{ fontSize: 10, color: C.soft, marginTop: 4 }}>
                        Org: {c.org} · {c.payDays} dager · {c.brukere.filter((b) => b.aktiv).length} aktive brukere
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: c.outstanding > 0 ? C.danger : C.green, marginBottom: 3 }}>
                        {c.outstanding > 0 ? `${c.outstanding.toLocaleString("nb-NO")} kr utestående` : "✓ Ingen utestående"}
                      </div>
                      <div style={{ fontSize: 9, color: C.soft }}>{c.contact}</div>
                      <div style={{ fontSize: 11, color: C.soft, marginTop: 4 }}>{isOpen ? "▲ Skjul" : "▼ Vis detaljer"}</div>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                    <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, background: C.greenXL }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Prismodell</div>

                      {c.prismodell === "rammeavtale" && c.rammePriser && (
                        <div>
                          <div style={{ fontSize: 10, color: C.soft, marginBottom: 8 }}>Fast pris per tjenestetype — faktureres samlet hver måned</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                            {Object.entries(c.rammePriser).map(([type, pris]) => (
                              <div
                                key={type}
                                style={{
                                  background: "white",
                                  borderRadius: 7,
                                  padding: "6px 9px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  border: `0.5px solid ${C.border}`,
                                }}
                              >
                                <span style={{ fontSize: 10, color: C.navy }}>{tjenesteNavn(type)}</span>
                                <span style={{ fontSize: 10, fontWeight: 600, color: C.sky }}>{pris} kr</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {c.prismodell === "per_bestilling" && (
                        <div style={{ background: "white", borderRadius: 8, padding: "9px 11px", border: `0.5px solid ${C.border}` }}>
                          <div style={{ fontSize: 11, color: C.navy, marginBottom: 3 }}>Standard tjenestepris per oppdrag</div>
                          <div style={{ fontSize: 10, color: C.soft }}>
                            Faktura sendes per bestilling · {c.payDays} dagers betalingsfrist · PDF e-post
                          </div>
                        </div>
                      )}

                      {c.prismodell === "maanedspakke" &&
                        "maanedsPris" in c &&
                        c.maanedsPris != null &&
                        "timerInkludert" in c &&
                        c.timerInkludert != null &&
                        "timerBrukt" in c &&
                        c.timerBrukt != null && (
                          <div>
                            <div style={{ background: "white", borderRadius: 8, padding: "9px 11px", border: `0.5px solid ${C.border}`, marginBottom: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>
                                  {c.maanedsPris.toLocaleString("nb-NO")} kr / mnd
                                </span>
                                <span style={{ fontSize: 10, color: "#6D28D9", fontWeight: 600 }}>{c.timerInkludert} timer inkludert</span>
                              </div>
                              <div style={{ fontSize: 9, color: C.soft, marginBottom: 4 }}>
                                Brukt denne måneden: {c.timerBrukt}/{c.timerInkludert} timer
                              </div>
                              <div style={{ height: 6, borderRadius: 50, background: C.border, overflow: "hidden" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    borderRadius: 50,
                                    background: c.timerBrukt / c.timerInkludert > 0.9 ? C.danger : "#6D28D9",
                                    width: `${(c.timerBrukt / c.timerInkludert) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>Tilknyttede brukere ({c.brukere.length})</div>
                        <button
                          type="button"
                          style={{
                            fontSize: 9,
                            padding: "3px 10px",
                            background: C.greenBg,
                            color: C.green,
                            border: `1px solid ${C.border}`,
                            borderRadius: 50,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: 600,
                          }}
                        >
                          + Legg til bruker
                        </button>
                      </div>
                      {c.brukere.map((b) => (
                        <div
                          key={b.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 9,
                            padding: "8px 10px",
                            background: b.aktiv ? "white" : C.softBg,
                            borderRadius: 9,
                            marginBottom: 5,
                            border: `0.5px solid ${C.border}`,
                            opacity: b.aktiv ? 1 : 0.65,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: b.aktiv ? C.greenDark : C.soft,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
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
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{b.name}</span>
                              <span
                                style={{
                                  fontSize: 9,
                                  padding: "1px 6px",
                                  borderRadius: 50,
                                  background: b.aktiv ? C.greenBg : C.softBg,
                                  color: b.aktiv ? C.green : C.soft,
                                }}
                              >
                                {b.aktiv ? "Aktiv" : "Inaktiv"}
                              </span>
                            </div>
                            <div style={{ fontSize: 9, color: C.soft, marginBottom: 4 }}>
                              {b.adresse} · f. {b.dob}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                              {b.tjenester.map((tj) => (
                                <span
                                  key={tj}
                                  style={{
                                    fontSize: 8,
                                    background: C.greenXL,
                                    color: C.green,
                                    padding: "1px 6px",
                                    borderRadius: 4,
                                    border: `0.5px solid ${C.border}`,
                                  }}
                                >
                                  {tjenesteNavn(tj)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                            <button
                              type="button"
                              style={{
                                fontSize: 9,
                                padding: "3px 8px",
                                background: "white",
                                color: C.navy,
                                border: `1px solid ${C.border}`,
                                borderRadius: 5,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Rediger
                            </button>
                            <button
                              type="button"
                              style={{
                                fontSize: 9,
                                padding: "3px 8px",
                                background: C.dangerBg,
                                color: C.danger,
                                border: "none",
                                borderRadius: 5,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Fjern
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 9, background: C.greenXL, borderRadius: 8, padding: "8px 11px", border: `0.5px solid ${C.border}` }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: C.green, marginBottom: 3 }}>📄 Fakturering denne måneden</div>
                        <div style={{ fontSize: 10, color: C.navyMid }}>
                          {c.prismodell === "rammeavtale" && "Samlefaktura sendes 1. neste måned via EHF/PEPPOL"}
                          {c.prismodell === "per_bestilling" &&
                            `${c.brukere.filter((b) => b.aktiv).length * 3} oppdrag · faktura genereres ved bestilling`}
                          {c.prismodell === "maanedspakke" &&
                            "maanedsPris" in c &&
                            c.maanedsPris != null &&
                            `Fast faktura ${c.maanedsPris.toLocaleString("nb-NO")} kr sendes 1. neste måned`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {activeTab === "fakturaer" && (
        <>
          <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
            Fakturaer
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kunde</th>
                  <th>Beløp</th>
                  <th>Forfaller</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Handling</th>
                </tr>
              </thead>
              <tbody>
                {B2B_INV.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{inv.id}</td>
                    <td style={{ fontWeight: 500 }}>{inv.customer}</td>
                    <td style={{ fontWeight: 600 }}>{inv.amount.toLocaleString("nb-NO")} kr</td>
                    <td style={{ color: inv.status === "overdue" ? C.danger : C.soft, fontSize: 10 }}>{inv.due}</td>
                    <td>
                      <Bdg status={inv.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 7px",
                          borderRadius: 50,
                          background: inv.ehf ? C.greenBg : "#F0F5F2",
                          color: inv.ehf ? C.green : C.soft,
                        }}
                      >
                        {inv.ehf ? "EHF/PEPPOL" : "PDF e-post"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        {inv.status === "overdue" && (
                          <button
                            type="button"
                            style={{
                              fontSize: 10,
                              padding: "3px 9px",
                              background: C.dangerBg,
                              color: C.danger,
                              border: `1px solid rgba(225,29,72,.2)`,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            📨 Send purring
                          </button>
                        )}
                        {inv.status !== "paid" && (
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
                              whiteSpace: "nowrap",
                            }}
                          >
                            ↩️ Kreditnota
                          </button>
                        )}
                        {inv.status === "paid" && (
                          <button
                            type="button"
                            style={{
                              fontSize: 10,
                              padding: "3px 9px",
                              background: "#F0FDF4",
                              color: "#16A34A",
                              border: "1px solid rgba(22,163,74,.2)",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ↩️ Kreditnota
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "avtalemodeller" && (
        <div>
          {avtaleModal && (
            <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  width: "100%",
                  maxWidth: 520,
                  maxHeight: "90vh",
                  overflow: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,.25)",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                    borderRadius: "18px 18px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>
                      {avtaleModal === "ny" ? "Ny avtalemodell" : "Rediger avtalemodell"}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
                      {avtaleForm.ikon} {avtaleForm.label || "Ny modell"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvtaleModal(null)}
                    style={{
                      background: "rgba(255,255,255,.15)",
                      border: "none",
                      color: "white",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  {avtaleModal !== "ny" && avtaleForm.systemModell && (
                    <div style={{ background: C.goldBg, borderRadius: 9, padding: "8px 12px", fontSize: 10, color: C.goldDark, marginBottom: 14, lineHeight: 1.6 }}>
                      ⚠️ Dette er en systemmodell. Du kan endre navn, ikon og beskrivelse, men ikke slette den.
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>Ikon</label>
                      <input
                        value={avtaleForm.ikon}
                        onChange={(e) => setAvtaleForm((f) => ({ ...f, ikon: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "9px 4px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 22,
                          textAlign: "center",
                          background: C.greenXL,
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>Navn</label>
                      <input
                        value={avtaleForm.label}
                        onChange={(e) => setAvtaleForm((f) => ({ ...f, label: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 13,
                          fontFamily: "inherit",
                          background: C.greenXL,
                          fontWeight: 600,
                        }}
                        placeholder="F.eks. Hybridavtale"
                        disabled={avtaleModal !== "ny" && avtaleForm.systemModell}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                      Beskrivelse
                    </label>
                    <textarea
                      value={avtaleForm.beskrivelse}
                      onChange={(e) => setAvtaleForm((f) => ({ ...f, beskrivelse: e.target.value }))}
                      rows={2}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 12,
                        fontFamily: "inherit",
                        background: C.greenXL,
                        resize: "vertical",
                      }}
                      placeholder="Beskriv når denne avtalemodellen passer..."
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                      Farge
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[C.sky, C.soft, C.green, "#6D28D9", "#0891B2", "#BE185D", "#7C3AED", C.gold, C.danger, "#16A34A"].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setAvtaleForm((f) => ({ ...f, farge: col }))}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: col,
                            cursor: "pointer",
                            border: `3px solid ${avtaleForm.farge === col ? "white" : "transparent"}`,
                            boxShadow: avtaleForm.farge === col ? `0 0 0 2px ${col}` : "none",
                            transition: "all .15s",
                            padding: 0,
                          }}
                          aria-label={`Velg farge ${col}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                        Faktureringstype
                      </label>
                      <select
                        value={avtaleForm.fakturaType}
                        onChange={(e) => setAvtaleForm((f) => ({ ...f, fakturaType: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 11,
                          fontFamily: "inherit",
                          background: C.greenXL,
                        }}
                      >
                        <option value="maanedlig">Månedlig</option>
                        <option value="per_oppdrag">Per oppdrag</option>
                        <option value="engang">Engangs</option>
                        <option value="kvartal">Kvartal</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                        Fakturadag
                      </label>
                      <input
                        type="number"
                        value={avtaleForm.fakturadag ?? ""}
                        onChange={(e) => setAvtaleForm((f) => ({ ...f, fakturadag: Number(e.target.value) || null }))}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: "inherit",
                          background: C.greenXL,
                        }}
                        placeholder="1–28"
                        min={1}
                        max={28}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                        Bet.frist (dager)
                      </label>
                      <input
                        type="number"
                        value={avtaleForm.betalingsfrist}
                        onChange={(e) => setAvtaleForm((f) => ({ ...f, betalingsfrist: Number(e.target.value) }))}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: "inherit",
                          background: C.greenXL,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "10px 13px",
                      borderRadius: 9,
                      border: `2px solid ${avtaleForm.farge}`,
                      background: `${avtaleForm.farge}10`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{avtaleForm.ikon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{avtaleForm.label || "Navn"}</div>
                      <div style={{ fontSize: 10, color: C.soft }}>{avtaleForm.beskrivelse || "Beskrivelse"}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 9px",
                        borderRadius: 50,
                        fontWeight: 600,
                        background: `${avtaleForm.farge}20`,
                        color: avtaleForm.farge,
                      }}
                    >
                      {avtaleForm.fakturaType === "maanedlig"
                        ? "Månedlig"
                        : avtaleForm.fakturaType === "per_oppdrag"
                          ? "Per oppdrag"
                          : avtaleForm.fakturaType === "kvartal"
                            ? "Kvartal"
                            : "Engangs"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!avtaleForm.systemModell && avtaleModal !== "ny" && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvtalemodeller((p) => p.filter((a) => a.id !== avtaleForm.id));
                          setAvtaleModal(null);
                        }}
                        style={{
                          padding: "9px 14px",
                          fontSize: 11,
                          borderRadius: 9,
                          background: C.dangerBg,
                          color: C.danger,
                          border: `1px solid rgba(225,29,72,.2)`,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontWeight: 600,
                        }}
                      >
                        🗑 Slett
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAvtaleModal(null)}
                      style={{
                        padding: "9px 14px",
                        fontSize: 11,
                        borderRadius: 9,
                        background: "white",
                        color: C.navy,
                        border: `1.5px solid ${C.border}`,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Avbryt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (avtaleModal === "ny") {
                          const id = avtaleForm.label
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          const row: AvtaleModell = {
                            ...avtaleForm,
                            id,
                            fakturadag: avtaleForm.fakturadag,
                          } as AvtaleModell;
                          setAvtalemodeller((p) => [...p, row]);
                        } else {
                          setAvtalemodeller((p) => p.map((a) => (a.id === avtaleForm.id ? ({ ...avtaleForm, fakturadag: avtaleForm.fakturadag } as AvtaleModell) : a)));
                        }
                        setAvtaleModal(null);
                      }}
                      className="btn bp"
                      style={{ flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 9, opacity: avtaleForm.label ? 1 : 0.5 }}
                    >
                      {avtaleModal === "ny" ? "+ Opprett modell" : "✓ Lagre"}
                    </button>
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
                Avtalemodeller
              </div>
              <div style={{ fontSize: 11, color: C.soft }}>
                {avtalemodeller.filter((a) => a.aktiv).length} aktive · Brukes ved oppretting av nye B2B-kunder
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAvtaleForm(defaultAvtaleForm());
                setAvtaleModal("ny");
              }}
              className="btn bp"
              style={{ fontSize: 12, padding: "8px 16px" }}
            >
              + Ny avtalemodell
            </button>
          </div>

          <div
            style={{
              background: C.skyBg,
              borderRadius: 10,
              padding: "9px 14px",
              marginBottom: 16,
              fontSize: 10,
              color: "#1e40af",
              lineHeight: 1.6,
              border: "1px solid rgba(37,99,235,.15)",
            }}
          >
            📋 <strong>Systemmodeller</strong> (grå lås) kan ikke slettes men kan redigeres. <strong>Egendefinerte modeller</strong> kan slettes hvis de
            ikke er i bruk hos aktive kunder.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 12, marginBottom: 16 }}>
            {avtalemodeller.map((a) => (
              <div key={a.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ height: 4, background: a.farge }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${a.farge}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {a.ikon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{a.label}</span>
                        {a.systemModell && (
                          <span style={{ fontSize: 8, background: C.softBg, color: C.soft, padding: "1px 6px", borderRadius: 50, fontWeight: 600 }}>
                            🔒 System
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.5 }}>{a.beskrivelse}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, background: `${a.farge}15`, color: a.farge, padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                      {a.fakturaType === "maanedlig"
                        ? "📅 Månedlig"
                        : a.fakturaType === "per_oppdrag"
                          ? "🧾 Per oppdrag"
                          : a.fakturaType === "kvartal"
                            ? "📆 Kvartal"
                            : "🔂 Engangs"}
                    </span>
                    {a.fakturadag != null && (
                      <span style={{ fontSize: 9, background: C.softBg, color: C.navyMid, padding: "2px 8px", borderRadius: 50 }}>
                        Dag {a.fakturadag}
                      </span>
                    )}
                    <span style={{ fontSize: 9, background: C.softBg, color: C.navyMid, padding: "2px 8px", borderRadius: 50 }}>
                      {a.betalingsfrist} dagers frist
                    </span>
                    <span style={{ fontSize: 9, background: C.softBg, color: C.navyMid, padding: "2px 8px", borderRadius: 50 }}>
                      {B2B_C.filter((bc) => bc.prismodell === a.id).length} kunder
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAvtaleForm(avtaleToForm(a));
                        setAvtaleModal(a);
                      }}
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
                        fontWeight: 600,
                      }}
                    >
                      ✏️ Rediger
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvtalemodeller((p) => p.map((x) => (x.id === a.id ? { ...x, aktiv: !x.aktiv } : x)))}
                      style={{
                        padding: "7px 12px",
                        fontSize: 11,
                        borderRadius: 8,
                        background: a.aktiv ? C.dangerBg : C.greenBg,
                        color: a.aktiv ? C.danger : C.green,
                        border: `1px solid ${a.aktiv ? "rgba(225,29,72,.2)" : C.border}`,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {a.aktiv ? "⏸" : "▶️"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div
              role="presentation"
              onClick={() => {
                setAvtaleForm(defaultAvtaleForm());
                setAvtaleModal("ny");
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
                minHeight: 160,
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
                  width: 40,
                  height: 40,
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
              <div style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Ny avtalemodell</div>
              <div style={{ fontSize: 10, color: C.soft, textAlign: "center", maxWidth: 140 }}>Definer en ny prisstruktur for B2B-kunder</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
