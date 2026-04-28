"use client";

import { ORDERS, type MockOrder } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "./ModalPortal";

const C = colors;

export interface KrediterPrivatSavePayload {
  kunde: string;
  oppdrag: string;
  oppdragId: string | null;
  belop: string;
  arsak: string | undefined;
  metode: string;
  modus: "knyttet" | "fri" | null;
}

export interface KrediterPrivatModalProps {
  onClose: () => void;
  onSave: (data: KrediterPrivatSavePayload) => void;
  prefilledOppdrag?: MockOrder | null;
  ordersCatalog?: MockOrder[];
}

export function KrediterPrivatModal({
  onClose,
  onSave,
  prefilledOppdrag = null,
  ordersCatalog = ORDERS,
}: KrediterPrivatModalProps) {
  const isPrefilled = !!prefilledOppdrag;
  const [modus, setModus] = useState<"knyttet" | "fri" | null>(isPrefilled ? "knyttet" : null);
  const [steg, setSteg] = useState(isPrefilled ? 2 : 1);
  const [metode, setMetode] = useState(prefilledOppdrag?.betaltVia ?? "vipps");
  const [kunde, setKunde] = useState(prefilledOppdrag?.customer ?? "");
  const [oppdrag, setOppdrag] = useState(prefilledOppdrag?.service ?? "");
  const [oppdragId, setOppdragId] = useState<string | null>(prefilledOppdrag?.id ?? null);
  const [belop, setBelop] = useState(prefilledOppdrag?.amount != null ? String(prefilledOppdrag.amount) : "");
  const [arsak, setArsak] = useState("");
  const [arsakType, setArsakType] = useState("ikke_gjennomfort");
  const [sokTekst, setSokTekst] = useState("");

  const arsakTyper = [
    { key: "ikke_gjennomfort", label: "Oppdrag ikke gjennomført", sub: "Sykepleier syk eller force majeure" },
    { key: "feil_pris", label: "Feil pris belastet", sub: "Prisavvik mot det avtalte" },
    { key: "kunde_avlyst", label: "Kunde avlyste i tide", sub: "Avlysning innenfor fristen" },
    { key: "kvalitet", label: "Kvalitetsklage", sub: "Kunde ikke fornøyd — etter vurdering" },
    { key: "annet", label: "Annet", sub: "Beskriv årsak manuelt" },
  ];

  const refMetoder = [
    { key: "vipps", label: "💜 Vipps", sub: "Tilbake på Vipps innen 1-3 virkedager", color: "#FF5B24" },
    { key: "stripe", label: "💳 Kort (Stripe)", sub: "Tilbake på kort innen 5-10 virkedager", color: C.sky },
  ];

  const filteredOrders = ordersCatalog.filter(
    (o) =>
      o.betaltVia !== "b2b" &&
      (sokTekst === "" ||
        o.customer.toLowerCase().includes(sokTekst.toLowerCase()) ||
        o.service.toLowerCase().includes(sokTekst.toLowerCase())),
  );

  const stegLabels = modus === "fri" ? ["Type", "Detaljer", "Bekreft"] : ["Bestilling", "Detaljer", "Bekreft"];

  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.5)", padding: 20 }}>
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
              {isPrefilled && prefilledOppdrag
                ? `Oppdrag #${prefilledOppdrag.id} · ${prefilledOppdrag.customer}`
                : "Ny kreditering"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>↩️ Krediter privatkunde</div>
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
            {stegLabels.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: steg > i + 1 ? C.green : steg === i + 1 ? C.green : "#E5E7EB",
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
            ))}
          </div>
        )}

        <div style={{ padding: "20px 22px" }}>
          {!modus && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 5 }}>
                Hva slags kreditering er dette?
              </div>
              <div style={{ fontSize: 11, color: C.soft, marginBottom: 18, lineHeight: 1.6 }}>
                Velg om krediteringen er knyttet til en konkret bestilling, eller om det er en frittstående kreditering.
              </div>
              {(
                [
                  {
                    key: "knyttet" as const,
                    icon: "🔗",
                    title: "Knytt til bestilling",
                    sub: "Finn bestillingen og krediter direkte. Kreditering knyttes til bestillingens historikk og spores automatisk.",
                    bg: C.greenXL,
                    border: C.green,
                  },
                  {
                    key: "fri" as const,
                    icon: "✏️",
                    title: "Fri kreditering",
                    sub: "Ingen bestillings-ID. Bruk for goodwill-kompensasjon, generell rabatt eller avtalte justeringer.",
                    bg: "#F5F3FF",
                    border: "#A78BFA",
                  },
                ] as const
              ).map((m) => (
                <div
                  key={m.key}
                  onClick={() => {
                    setModus(m.key);
                    setSteg(1);
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
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Søk opp bestilling
                </label>
                <input
                  value={sokTekst}
                  onChange={(e) => setSokTekst(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 9,
                    fontSize: 12,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                  placeholder="Kundenavn, tjeneste eller bestillings-ID..."
                />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Bestillinger</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, maxHeight: 280, overflowY: "auto" }}>
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setKunde(o.customer);
                      setOppdrag(o.service);
                      setBelop(String(o.amount));
                      setOppdragId(o.id);
                      setMetode(o.betaltVia ?? "vipps");
                      setSteg(2);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 9,
                      border: `1.5px solid ${C.border}`,
                      cursor: "pointer",
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
                    <div
                      style={{
                        flex: "0 0 32px",
                        height: 32,
                        borderRadius: 8,
                        background: C.greenBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                      }}
                    >
                      {o.service?.includes("Morg") ? "🚿" : o.service?.includes("Prak") ? "🏠" : o.service?.includes("Trille") ? "🍃" : "☕"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{o.customer}</div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.soft,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {o.service} · {o.date} · {o.time}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{o.amount} kr</div>
                      <span
                        style={{
                          fontSize: 9,
                          background: o.betaltVia === "vipps" ? "#FFF0EB" : C.skyBg,
                          color: o.betaltVia === "vipps" ? C.vipps : C.sky,
                          padding: "1px 7px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        {o.betaltVia === "vipps" ? "💜" : "💳"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setModus(null)}
                style={{
                  width: "100%",
                  padding: "10px 0",
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
                ✏️ <strong>Fri kreditering</strong> — ingen bestillings-ID kreves. Bruk dette for kompensasjon, goodwill eller
                avtalte justeringer utenfor enkeltbestillinger.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Kundenavn
                  </label>
                  <input
                    value={kunde}
                    onChange={(e) => setKunde(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="Navn på kunden"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Beskrivelse
                  </label>
                  <input
                    value={oppdrag}
                    onChange={(e) => setOppdrag(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="F.eks. Goodwill-kompensasjon"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Beløp (kr)
                  </label>
                  <input
                    value={belop}
                    onChange={(e) => setBelop(e.target.value)}
                    type="number"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="0"
                  />
                </div>
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
                  onClick={() => kunde && belop && setSteg(2)}
                  className="btn bp"
                  style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10, opacity: kunde && belop ? 1 : 0.5 }}
                >
                  Neste →
                </button>
              </div>
            </div>
          )}

          {steg === 2 && (
            <div>
              {modus === "knyttet" && oppdragId && (
                <div
                  style={{
                    background: C.greenXL,
                    borderRadius: 10,
                    padding: "10px 13px",
                    marginBottom: 16,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔗</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>Knyttet til bestilling #{oppdragId}</div>
                    <div style={{ fontSize: 10, color: C.soft }}>
                      {oppdrag} · {kunde} · {belop} kr
                    </div>
                  </div>
                  <span style={{ fontSize: 10, background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                    ✓ Sporbar
                  </span>
                </div>
              )}
              {modus === "fri" && (
                <div
                  style={{
                    background: "#F5F3FF",
                    borderRadius: 10,
                    padding: "10px 13px",
                    marginBottom: 16,
                    border: "1px solid #C4B5FD",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>✏️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#5B21B6" }}>Fri kreditering — {kunde}</div>
                    <div style={{ fontSize: 10, color: C.soft }}>
                      {oppdrag} · {Number(belop).toLocaleString("nb-NO")} kr
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  Årsak til kreditering
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {arsakTyper.map((a) => (
                    <div
                      key={a.key}
                      onClick={() => setArsakType(a.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 9,
                        border: `2px solid ${arsakType === a.key ? C.green : C.border}`,
                        background: arsakType === a.key ? C.greenXL : "white",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `2px solid ${arsakType === a.key ? C.green : C.border}`,
                          background: arsakType === a.key ? C.green : "white",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {arsakType === a.key && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{a.label}</div>
                        <div style={{ fontSize: 10, color: C.soft }}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {arsakType === "annet" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Utfyllende beskrivelse
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
                    placeholder="Beskriv årsaken..."
                  />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  Refusjonsmetode
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {refMetoder.map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setMetode(m.key)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 9,
                        border: `2px solid ${metode === m.key ? m.color : C.border}`,
                        background: metode === m.key ? `${m.color}12` : "white",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: metode === m.key ? m.color : C.navy, marginBottom: 2 }}>
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
                <button type="button" onClick={() => setSteg(3)} className="btn bp" style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10 }}>
                  Se oppsummering →
                </button>
              </div>
            </div>
          )}

          {steg === 3 && (
            <div>
              <div style={{ background: C.greenXL, borderRadius: 12, padding: "16px 18px", marginBottom: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Oppsummering</div>
                {(
                  [
                    { l: "Type", v: modus === "knyttet" ? "🔗 Knyttet til bestilling #" + oppdragId : "✏️ Fri kreditering" },
                    { l: "Kunde", v: kunde },
                    { l: "Oppdrag / beskrivelse", v: oppdrag },
                    { l: "Beløp", v: `${Number(belop).toLocaleString("nb-NO")} kr` },
                    {
                      l: "Årsak",
                      v: (arsakTyper.find((a) => a.key === arsakType)?.label ?? "") + (arsak ? " — " + arsak : ""),
                    },
                    {
                      l: "Refusjon via",
                      v: metode === "vipps" ? "💜 Vipps — 1-3 virkedager" : "💳 Kort — 5-10 virkedager",
                    },
                  ] as const
                ).map((r) => (
                  <div
                    key={r.l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "7px 0",
                      borderBottom: `1px solid ${C.border}`,
                      fontSize: 12,
                      gap: 12,
                    }}
                  >
                    <span style={{ color: C.soft, flexShrink: 0 }}>{r.l}</span>
                    <span style={{ fontWeight: 600, color: C.navy, textAlign: "right" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#FFF3E0",
                  borderRadius: 9,
                  padding: "9px 13px",
                  fontSize: 10,
                  color: "#92400E",
                  marginBottom: 16,
                  lineHeight: 1.6,
                }}
              >
                ⚠️ Denne handlingen kan ikke angres. Refusjonen sendes umiddelbart via{" "}
                {metode === "vipps" ? "Vipps ePayments API" : "Stripe refunds API"}.
                {modus === "knyttet" && " Bestilling #" + oppdragId + " merkes som kreditert."}
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
                      oppdrag,
                      oppdragId,
                      belop,
                      arsak: arsakTyper.find((a) => a.key === arsakType)?.label,
                      metode,
                      modus,
                    });
                    onClose();
                  }}
                  className="btn bp"
                  style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 10 }}
                >
                  ✓ Bekreft refusjon — {Number(belop).toLocaleString("nb-NO")} kr
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
