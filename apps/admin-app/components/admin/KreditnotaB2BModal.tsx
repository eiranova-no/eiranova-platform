"use client";

import { B2B_C, KREDITERINGER, ORDERS, type MockOrder } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "./ModalPortal";

const C = colors;

export interface KreditnotaB2BLinje {
  beskrivelse: string;
  antall: number | string;
  pris: string;
  _oppdragId?: string;
}

export interface KreditnotaB2BSavePayload {
  kunde: string;
  linjer: KreditnotaB2BLinje[];
  total: number;
  arsak: string;
  levering: string;
  modus: "knyttet" | "fri" | null;
  oppdragIds: string[];
}

export interface KreditnotaB2BModalProps {
  onClose: () => void;
  onSave: (data: KreditnotaB2BSavePayload) => void;
  prefilledOppdrag?: MockOrder | null;
}

export function KreditnotaB2BModal({ onClose, onSave, prefilledOppdrag = null }: KreditnotaB2BModalProps) {
  const isPrefilled = !!prefilledOppdrag;
  const [modus, setModus] = useState<"knyttet" | "fri" | null>(isPrefilled ? "knyttet" : null);
  const [steg, setSteg] = useState(isPrefilled ? 2 : 1);
  const [kunde, setKunde] = useState(prefilledOppdrag?.customer ?? "");
  const [sokTekst, setSokTekst] = useState("");
  const [valgteOppdrag, setValgteOppdrag] = useState<MockOrder[]>(prefilledOppdrag ? [prefilledOppdrag] : []);
  const [linjer, setLinjer] = useState<KreditnotaB2BLinje[]>(
    prefilledOppdrag
      ? [{ beskrivelse: prefilledOppdrag.service, antall: 1, pris: String(prefilledOppdrag.amount ?? 0) }]
      : [{ beskrivelse: "", antall: 1, pris: "" }],
  );
  const [arsak, setArsak] = useState("");
  const [levering, setLevering] = useState<"ehf" | "pdf">("ehf");

  const total = linjer.reduce((s, l) => s + (Number(l.antall) || 0) * (Number(l.pris) || 0), 0);
  const addLinje = () => setLinjer((p) => [...p, { beskrivelse: "", antall: 1, pris: "" }]);
  const updateLinje = (i: number, field: keyof KreditnotaB2BLinje, val: string | number) =>
    setLinjer((p) => p.map((l, j) => (j === i ? { ...l, [field]: val } : l)));

  const b2bOrders = ORDERS.filter(
    (o) =>
      o.betaltVia === "b2b" &&
      (sokTekst === "" ||
        o.customer.toLowerCase().includes(sokTekst.toLowerCase()) ||
        o.service.toLowerCase().includes(sokTekst.toLowerCase())),
  );

  const toggleOppdrag = (o: MockOrder) => {
    const exists = valgteOppdrag.find((v) => v.id === o.id);
    if (exists) {
      setValgteOppdrag((p) => p.filter((v) => v.id !== o.id));
      setLinjer((p) => p.filter((l) => l._oppdragId !== o.id));
    } else {
      setValgteOppdrag((p) => [...p, o]);
      setLinjer((p) => [...p, { beskrivelse: o.service, antall: 1, pris: String(o.amount ?? 0), _oppdragId: o.id }]);
    }
  };

  const b2bKunder = B2B_C.map((c) => c.name);
  const selectedOrg = B2B_C.find((c) => c.name === kunde);

  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.5)", padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          width: "100%",
          maxWidth: 600,
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            background: "linear-gradient(135deg,#1A2E24,#2C5C52)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.55)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 2,
              }}
            >
              {isPrefilled
                ? `B2B Oppdrag #${prefilledOppdrag.id} · ${prefilledOppdrag.customer}`
                : "B2B Kreditering"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>📄 Utstedd kreditnota</div>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        {modus && (
          <div style={{ display: "flex", padding: "14px 22px", borderBottom: `1px solid ${C.border}`, gap: 0 }}>
            {(modus === "knyttet" ? ["Oppdrag", "Kreditlinjer", "Send"] : ["Mottaker", "Kreditlinjer", "Send"]).map(
              (s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: steg > i + 1 ? "#2C5C52" : steg === i + 1 ? "#2C5C52" : "#E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: steg >= i + 1 ? "white" : C.soft,
                      }}
                    >
                      {steg > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: steg === i + 1 ? 600 : 400, color: steg === i + 1 ? C.navy : C.soft }}>
                      {s}
                    </span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: C.border, margin: "0 8px" }} />}
                </div>
              ),
            )}
          </div>
        )}

        <div style={{ padding: "20px 22px" }}>
          {!modus && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 5 }}>Hva slags kreditnota er dette?</div>
              <div style={{ fontSize: 11, color: C.soft, marginBottom: 18, lineHeight: 1.6 }}>
                Velg om kreditnotaen knyttes til konkrete oppdrag/fakturalinjer, eller om det er en frittstående kreditering.
              </div>
              {[
                {
                  key: "knyttet" as const,
                  icon: "🔗",
                  title: "Knytt til oppdrag",
                  sub: "Velg ett eller flere konkrete B2B-oppdrag. Kreditlinjer fylles ut automatisk. Kreditnota knyttes til bestillings-ID og spores i fakturahistorikk.",
                  bg: "#EDF5F3",
                  border: "#2C5C52",
                },
                {
                  key: "fri" as const,
                  icon: "✏️",
                  title: "Fri kreditnota",
                  sub: "Ingen bestillings-ID. Bruk for perioderabatter, kompensasjon, avtalte justeringer eller goodwill utenfor enkeltoppdrag.",
                  bg: "#F5F3FF",
                  border: "#A78BFA",
                },
              ].map((m) => (
                <div
                  key={m.key}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setModus(m.key);
                    setSteg(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setModus(m.key);
                      setSteg(1);
                    }
                  }}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 13,
                    border: `2px solid ${m.border}`,
                    background: m.bg,
                    cursor: "pointer",
                    marginBottom: 10,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 28 }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.55 }}>{m.sub}</div>
                    </div>
                    <span style={{ color: C.soft, fontSize: 20 }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modus === "knyttet" && steg === 1 && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  1. Velg organisasjon
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {b2bKunder.map((k) => {
                    const org = B2B_C.find((c) => c.name === k);
                    const orgOrders = ORDERS.filter((o) => o.b2bOrg === k);
                    return (
                      <div
                        key={k}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setKunde(k);
                          setSokTekst("");
                          setValgteOppdrag([]);
                          setLinjer([{ beskrivelse: "", antall: 1, pris: "" }]);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setKunde(k);
                            setSokTekst("");
                            setValgteOppdrag([]);
                            setLinjer([{ beskrivelse: "", antall: 1, pris: "" }]);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: `2px solid ${kunde === k ? "#2C5C52" : C.border}`,
                          background: kunde === k ? "#EDF5F3" : "white",
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: "#EEF2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          🏢
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{k}</div>
                          <div style={{ fontSize: 10, color: C.soft }}>
                            {org?.type} · {org?.brukere?.length} brukere · {orgOrders.length} oppdrag
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 9, color: C.soft }}>{org?.peppol ? "EHF/PEPPOL" : "PDF"}</div>
                          {kunde === k && (
                            <div style={{ fontSize: 10, color: "#2C5C52", fontWeight: 600 }}>✓ Valgt</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {kunde &&
                (() => {
                  const orgData = B2B_C.find((c) => c.name === kunde);
                  const orgOrders = ORDERS.filter((o) => o.b2bOrg === kunde);
                  const brukere = [...new Set(orgOrders.map((o) => o.customer))].map((navn) => {
                    const brukerInfo = orgData?.brukere?.find((b) => b.name === navn);
                    return { navn, info: brukerInfo };
                  });
                  const filteredOrders = orgOrders.filter((o) => {
                    const term = sokTekst.toLowerCase();
                    return (
                      term === "" ||
                      o.customer.toLowerCase().includes(term) ||
                      o.service.toLowerCase().includes(term) ||
                      o.id.toLowerCase().includes(term)
                    );
                  });

                  return (
                    <div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                          2. Søk på bruker eller tjeneste
                        </label>
                        <input
                          value={sokTekst}
                          onChange={(e) => setSokTekst(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 9,
                            fontSize: 12,
                            fontFamily: "inherit",
                            background: C.greenXL,
                          }}
                          placeholder="Navn på bruker, tjeneste eller oppdrag-ID..."
                        />
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                        <button
                          type="button"
                          onClick={() => setSokTekst("")}
                          style={{
                            fontSize: 10,
                            padding: "3px 10px",
                            borderRadius: 50,
                            border: `1px solid ${sokTekst === "" ? C.green : C.border}`,
                            background: sokTekst === "" ? C.greenBg : "white",
                            color: sokTekst === "" ? C.green : C.soft,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: sokTekst === "" ? 600 : 400,
                          }}
                        >
                          Alle ({orgOrders.length})
                        </button>
                        {brukere.map((b) => (
                          <button
                            key={b.navn}
                            type="button"
                            onClick={() => setSokTekst(b.navn)}
                            style={{
                              fontSize: 10,
                              padding: "3px 10px",
                              borderRadius: 50,
                              border: `1px solid ${sokTekst === b.navn ? "#2C5C52" : C.border}`,
                              background: sokTekst === b.navn ? "#EDF5F3" : "white",
                              color: sokTekst === b.navn ? "#2C5C52" : C.soft,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontWeight: sokTekst === b.navn ? 600 : 400,
                            }}
                          >
                            👤 {b.navn} ({orgOrders.filter((o) => o.customer === b.navn).length})
                          </button>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
                        3. Velg oppdrag å kreditere
                        {valgteOppdrag.length > 0 && (
                          <span
                            style={{
                              background: C.greenBg,
                              color: C.green,
                              padding: "1px 9px",
                              borderRadius: 50,
                              marginLeft: 8,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {valgteOppdrag.length} valgt ·{" "}
                            {valgteOppdrag.reduce((s, o) => s + (o.amount || 0), 0).toLocaleString("nb-NO")} kr
                          </span>
                        )}
                      </div>
                      <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                        {filteredOrders.length === 0 ? (
                          <div
                            style={{
                              fontSize: 11,
                              color: C.soft,
                              textAlign: "center",
                              padding: 20,
                              background: C.softBg,
                              borderRadius: 9,
                            }}
                          >
                            Ingen oppdrag funnet — prøv et annet søk
                          </div>
                        ) : (
                          filteredOrders.map((o) => {
                            const valgt = !!valgteOppdrag.find((v) => v.id === o.id);
                            return (
                              <div
                                key={o.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleOppdrag(o)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleOppdrag(o);
                                  }
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  borderRadius: 9,
                                  border: `2px solid ${valgt ? "#2C5C52" : C.border}`,
                                  background: valgt ? "#EDF5F3" : "white",
                                  cursor: "pointer",
                                  transition: "all .15s",
                                }}
                              >
                                <div
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 5,
                                    border: `2px solid ${valgt ? "#2C5C52" : C.border}`,
                                    background: valgt ? "#2C5C52" : "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    color: "white",
                                    flexShrink: 0,
                                    fontWeight: 700,
                                  }}
                                >
                                  {valgt ? "✓" : ""}
                                </div>
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background: C.greenBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: C.green,
                                    flexShrink: 0,
                                  }}
                                >
                                  {o.customer
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{o.customer}</span>
                                    <span
                                      style={{
                                        fontSize: 9,
                                        background: "#EEF2FF",
                                        color: "#3B82F6",
                                        padding: "1px 6px",
                                        borderRadius: 50,
                                      }}
                                    >
                                      {o.b2bOrg?.split(" ")[0]}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 10, color: C.green, fontWeight: 500 }}>{o.service}</span>
                                    <span style={{ fontSize: 9, color: C.soft }}>·</span>
                                    <span style={{ fontSize: 10, color: C.soft }}>
                                      {o.date} {o.time}
                                    </span>
                                    <span style={{ fontSize: 9, color: C.soft }}>·</span>
                                    <span style={{ fontSize: 9, color: C.soft, fontFamily: "monospace" }}>{o.id}</span>
                                  </div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{o.amount} kr</div>
                                  <div
                                    style={{
                                      fontSize: 9,
                                      background: o.status === "completed" ? "#F0FDF4" : C.goldBg,
                                      color: o.status === "completed" ? "#16A34A" : C.goldDark,
                                      padding: "1px 6px",
                                      borderRadius: 50,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {o.status === "completed" ? "✓ Fullført" : o.status === "active" ? "Aktiv" : "Kommende"}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })()}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Årsak til kreditnota
                </label>
                <textarea
                  value={arsak}
                  onChange={(e) => setArsak(e.target.value)}
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
                  placeholder="F.eks. Morgensstell ikke gjennomført 3. mars — sykepleier syk..."
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setModus(null)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    borderRadius: 10,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Tilbake
                </button>
                <button
                  type="button"
                  onClick={() => kunde && setSteg(2)}
                  className="btn bp"
                  style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10, background: "#2C5C52", opacity: kunde ? 1 : 0.5 }}
                >
                  {valgteOppdrag.length > 0 ? `Neste — ${valgteOppdrag.length} oppdrag valgt →` : "Neste — rediger linjer →"}
                </button>
              </div>
            </div>
          )}

          {modus === "fri" && steg === 1 && (
            <div>
              <div
                style={{
                  background: "#F5F3FF",
                  borderRadius: 9,
                  padding: "9px 13px",
                  fontSize: 10,
                  color: "#5B21B6",
                  marginBottom: 16,
                  lineHeight: 1.55,
                  border: "1px solid #C4B5FD",
                }}
              >
                ✏️ <strong>Fri kreditnota</strong> — ingen oppdrag-ID kreves. Bruk for perioderabatter, kompensasjon eller avtalte
                justeringer.
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  Velg B2B-mottaker
                </label>
                {b2bKunder.map((k) => (
                  <div
                    key={k}
                    role="button"
                    tabIndex={0}
                    onClick={() => setKunde(k)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setKunde(k);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: `2px solid ${kunde === k ? "#6D28D9" : C.border}`,
                      background: kunde === k ? "#F5F3FF" : "white",
                      cursor: "pointer",
                      marginBottom: 7,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#EDE9FE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      🏢
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{k}</div>
                      <div style={{ fontSize: 10, color: C.soft }}>{B2B_C.find((c) => c.name === k)?.type}</div>
                    </div>
                    {kunde === k && (
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#6D28D9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 11,
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Årsak til kreditnota
                </label>
                <textarea
                  value={arsak}
                  onChange={(e) => setArsak(e.target.value)}
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
                  placeholder="F.eks. Goodwill-kompensasjon mars 2026..."
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setModus(null)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    borderRadius: 10,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Tilbake
                </button>
                <button
                  type="button"
                  onClick={() => kunde && setSteg(2)}
                  className="btn bp"
                  style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10, background: "#2C5C52", opacity: kunde ? 1 : 0.5 }}
                >
                  Neste →
                </button>
              </div>
            </div>
          )}

          {steg === 2 && (
            <div>
              {modus === "knyttet" && valgteOppdrag.length > 0 && (
                <div
                  style={{
                    background: "#EDF5F3",
                    borderRadius: 9,
                    padding: "9px 13px",
                    fontSize: 10,
                    color: "#2C5C52",
                    marginBottom: 14,
                    lineHeight: 1.55,
                    border: "1px solid rgba(44,92,82,.2)",
                  }}
                >
                  🔗 <strong>Knyttet til {valgteOppdrag.length} oppdrag</strong> ({valgteOppdrag.map((o) => "#" + o.id).join(", ")}) — linjer er
                  forhåndsutfylt. Juster beløp ved behov.
                </div>
              )}
              {modus === "fri" && (
                <div
                  style={{
                    background: "#F5F3FF",
                    borderRadius: 9,
                    padding: "9px 13px",
                    fontSize: 10,
                    color: "#5B21B6",
                    marginBottom: 14,
                    border: "1px solid #C4B5FD",
                  }}
                >
                  ✏️ <strong>Fri kreditnota til {kunde}</strong> — legg til linjer manuelt.
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Kreditlinjer</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 88px 28px", gap: "4px 8px", marginBottom: 4 }}>
                {["Beskrivelse", "Ant.", "Pris kr", ""].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: C.soft,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      padding: "0 2px",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {linjer.map((l, i) => (
                <div
                  key={i}
                  style={{ display: "grid", gridTemplateColumns: "1fr 52px 88px 28px", gap: "4px 8px", marginBottom: 6, alignItems: "center" }}
                >
                  <input
                    value={l.beskrivelse}
                    onChange={(e) => updateLinje(i, "beskrivelse", e.target.value)}
                    style={{
                      padding: "8px 10px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="Tjeneste eller beskrivelse"
                  />
                  <input
                    value={l.antall}
                    onChange={(e) => updateLinje(i, "antall", e.target.value)}
                    type="number"
                    style={{
                      padding: "8px 6px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={l.pris}
                    onChange={(e) => updateLinje(i, "pris", e.target.value)}
                    type="number"
                    style={{
                      padding: "8px 8px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      textAlign: "right",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => linjer.length > 1 && setLinjer((p) => p.filter((_, j) => j !== i))}
                    style={{
                      background: linjer.length > 1 ? C.dangerBg : "#F3F4F6",
                      color: linjer.length > 1 ? C.danger : C.soft,
                      border: "none",
                      borderRadius: 6,
                      cursor: linjer.length > 1 ? "pointer" : "default",
                      fontSize: 13,
                      fontWeight: 700,
                      height: 32,
                      width: 28,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLinje}
                style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  background: C.greenBg,
                  color: C.green,
                  border: `1px solid ${C.border}`,
                  borderRadius: 7,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginBottom: 14,
                }}
              >
                + Legg til linje
              </button>
              <div
                style={{
                  background: C.greenXL,
                  borderRadius: 9,
                  padding: "11px 14px",
                  marginBottom: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Total kreditnota</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#2C5C52" }}>{total.toLocaleString("nb-NO")} kr</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  Leveringsformat
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { key: "ehf" as const, label: "📡 EHF/PEPPOL", sub: "Automatisk til kommuner" },
                    { key: "pdf" as const, label: "📄 PDF e-post", sub: "Sendes manuelt" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      role="button"
                      tabIndex={0}
                      onClick={() => setLevering(m.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setLevering(m.key);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: 9,
                        border: `2px solid ${levering === m.key ? "#2C5C52" : C.border}`,
                        background: levering === m.key ? "#EDF5F3" : "white",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: levering === m.key ? "#2C5C52" : C.navy,
                          marginBottom: 1,
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ fontSize: 9, color: C.soft }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSteg(1)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    borderRadius: 10,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Tilbake
                </button>
                <button
                  type="button"
                  onClick={() => total > 0 && setSteg(3)}
                  className="btn bp"
                  style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10, background: "#2C5C52", opacity: total > 0 ? 1 : 0.5 }}
                >
                  Forhåndsvisning →
                </button>
              </div>
            </div>
          )}

          {steg === 3 && (
            <div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <div
                  style={{
                    background: "#1A2E24",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>EiraNova AS</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>Org.nr: 923 456 789 · eiranova.no</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E8C4A4" }}>KREDITNOTA</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>
                      KN-2026-{String(KREDITERINGER.length + 1).padStart(3, "0")}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)" }}>{new Date().toLocaleDateString("nb-NO")}</div>
                  </div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <div>
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
                        Til
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{kunde}</div>
                      <div style={{ fontSize: 10, color: C.soft }}>{selectedOrg?.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
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
                        Type
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          background: modus === "knyttet" ? C.greenBg : "#F5F3FF",
                          color: modus === "knyttet" ? C.green : "#6D28D9",
                          padding: "2px 9px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        {modus === "knyttet" ? "🔗 Knyttet til oppdrag" : "✏️ Fri kreditnota"}
                      </span>
                    </div>
                  </div>
                  {arsak && (
                    <div style={{ fontSize: 10, color: C.soft, marginBottom: 10, fontStyle: "italic" }}>&quot;{arsak}&quot;</div>
                  )}
                  {modus === "knyttet" && valgteOppdrag.length > 0 && (
                    <div style={{ fontSize: 10, color: C.soft, marginBottom: 10 }}>
                      Ref. oppdrag: {valgteOppdrag.map((o) => `#${o.id}`).join(", ")}
                    </div>
                  )}
                  <div className="tw" style={{ marginBottom: 10 }}>
                    <table className="tbl">
                      <thead>
                        <tr>
                          {["Beskrivelse", "Ant.", "Pris", "Sum"].map((h) => (
                            <th key={h} style={{ textAlign: h === "Ant." || h === "Pris" || h === "Sum" ? "right" : "left" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {linjer
                          .filter((l) => l.beskrivelse)
                          .map((l, i) => (
                            <tr key={i}>
                              <td>{l.beskrivelse}</td>
                              <td style={{ textAlign: "right" }}>{l.antall}</td>
                              <td style={{ textAlign: "right" }}>{Number(l.pris).toLocaleString("nb-NO")} kr</td>
                              <td style={{ textAlign: "right", fontWeight: 600 }}>
                                {(Number(l.antall) * Number(l.pris)).toLocaleString("nb-NO")} kr
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `2px solid ${C.navy}` }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Total kreditbeløp</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#2C5C52" }}>{total.toLocaleString("nb-NO")} kr</span>
                  </div>
                  <div style={{ fontSize: 9, color: C.soft, marginTop: 6 }}>
                    MVA: 0% (helsetjenester unntatt jf. mval. §3-2) · Trekkes fra neste faktura eller utbetales etter avtale.
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: C.greenXL,
                  borderRadius: 9,
                  padding: "9px 13px",
                  fontSize: 10,
                  color: C.navyMid,
                  marginBottom: 16,
                  lineHeight: 1.55,
                }}
              >
                📡 Sendes som{" "}
                <strong>{levering === "ehf" ? "EHF/PEPPOL til kommunens fakturasystem" : "PDF til kontakt-e-post"}</strong>. Registreres i
                Tripletex og aktivitetslogg.
                {modus === "knyttet" &&
                  valgteOppdrag.length > 0 &&
                  ` Oppdrag ${valgteOppdrag.map((o) => "#" + o.id).join(", ")} merkes som kreditert.`}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSteg(2)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    borderRadius: 10,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Tilbake
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSave({
                      kunde,
                      linjer,
                      total,
                      arsak,
                      levering,
                      modus,
                      oppdragIds: valgteOppdrag.map((o) => o.id),
                    });
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    fontSize: 13,
                    borderRadius: 10,
                    background: "#2C5C52",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  📤 Send kreditnota — {total.toLocaleString("nb-NO")} kr
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
