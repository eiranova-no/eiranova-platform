"use client";

import { KANSELLERING_REGLER, type MockNurse, type OppdragEndring } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "./ModalPortal";
import { useAdminToast } from "./useAdminToast";

const C = colors;

/** Data shape for modal (OPPDRAG-rad eller utvidet ORDERS-rad). */
export interface OppdragModalData {
  id: string;
  service: string;
  customer: string;
  date: string;
  time: string;
  nurse: string;
  amount: number;
  betaltVia: string;
  phone: string;
  address?: string;
  icon?: string;
  opprettet?: string;
  endringer: OppdragEndring[];
}

export interface OppdragModalProps {
  oppdrag: OppdragModalData;
  nurses: MockNurse[];
  onClose: () => void;
  onSave: (updated: OppdragModalData, arsak: string, arsakType: string) => void;
}

export function OppdragModal({ oppdrag, nurses, onClose, onSave }: OppdragModalProps) {
  const { ToastContainer } = useAdminToast();
  const [tab, setTab] = useState("detaljer");
  const [sykepleier, setSykepleier] = useState(oppdrag.nurse);
  const [dato, setDato] = useState(oppdrag.date);
  const [tid, setTid] = useState(oppdrag.time);
  const [arsak, setArsak] = useState("");
  const [arsakType, setArsakType] = useState("sykepleier_syk");

  const saved = () => {
    onSave({ ...oppdrag, nurse: sykepleier, date: dato, time: tid }, arsak, arsakType);
    onClose();
  };

  const arsakTyper = [
    { key: "sykepleier_syk", label: "🤒 Sykepleier syk", refusjon: "Full refusjon til kunde" },
    { key: "kunde_syk", label: "🤧 Kunde syk / avlyser", refusjon: "Avhenger av varslingstid" },
    { key: "tidendring", label: "🕐 Endre tidspunkt", refusjon: "Ingen refusjon" },
    { key: "bytte_sykepleier", label: "🔄 Bytte sykepleier", refusjon: "Ingen refusjon" },
    { key: "annet", label: "📝 Annet", refusjon: "Vurderes manuelt" },
  ];

  const refusjonFarge =
    arsakType === "sykepleier_syk" ? "#16A34A" : arsakType === "kunde_syk" ? C.gold : C.soft;

  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
      <ToastContainer />
      <div
        style={{
          background: "white",
          borderRadius: 18,
          width: "100%",
          maxWidth: 620,
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
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.55)",
                marginBottom: 3,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Oppdrag #{oppdrag.id}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "white", marginBottom: 2 }}>
              {oppdrag.icon} {oppdrag.service}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>
              {oppdrag.customer} · {oppdrag.date} {oppdrag.time}
            </div>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "white" }}>
          {(
            [
              ["detaljer", "📋 Detaljer"],
              ["endre", "✏️ Endre oppdrag"],
              ["historikk", "🕐 Endringslogg"],
            ] as const
          ).map(([t, l]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 12,
                fontWeight: tab === t ? 600 : 400,
                border: "none",
                background: "transparent",
                color: tab === t ? C.green : C.soft,
                borderBottom: tab === t ? `2.5px solid ${C.green}` : "2.5px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ padding: "20px 22px" }}>
          {tab === "detaljer" && (
            <div>
              <div className="stack-sm-1" style={{ marginBottom: 16 }}>
                {[
                  { l: "Kunde", v: oppdrag.customer, icon: "👤" },
                  { l: "Telefon", v: oppdrag.phone, icon: "📞" },
                  { l: "Adresse", v: oppdrag.address ?? "—", icon: "📍" },
                  { l: "Tjeneste", v: oppdrag.service, icon: "🏥" },
                  { l: "Dato & tid", v: `${oppdrag.date} kl. ${oppdrag.time}`, icon: "🕐" },
                  { l: "Sykepleier", v: oppdrag.nurse, icon: "🩺" },
                  { l: "Beløp", v: `${oppdrag.amount} kr`, icon: "💰" },
                  {
                    l: "Betalt via",
                    v:
                      oppdrag.betaltVia === "b2b"
                        ? "B2B faktura"
                        : oppdrag.betaltVia === "vipps"
                          ? "💜 Vipps"
                          : "💳 Kort",
                    icon: "🧾",
                  },
                ].map((r) => (
                  <div key={r.l} style={{ background: C.greenXL, borderRadius: 9, padding: "10px 12px" }}>
                    <div
                      style={{
                        fontSize: 9,
                        color: C.soft,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 3,
                      }}
                    >
                      {r.icon} {r.l}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setTab("endre")}
                  className="btn bp"
                  style={{ fontSize: 12, padding: "8px 18px", borderRadius: 9 }}
                >
                  ✏️ Endre dette oppdraget
                </button>
                <button
                  type="button"
                  style={{
                    fontSize: 12,
                    padding: "8px 18px",
                    borderRadius: 9,
                    background: C.dangerBg,
                    color: C.danger,
                    border: `1px solid rgba(225,29,72,.2)`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  🚫 Avlys oppdrag
                </button>
              </div>
            </div>
          )}
          {tab === "endre" && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
                  Hva er årsaken til endringen?
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {arsakTyper.map((a) => (
                    <div
                      key={a.key}
                      onClick={() => setArsakType(a.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: `2px solid ${arsakType === a.key ? C.green : C.border}`,
                        background: arsakType === a.key ? C.greenXL : "white",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: arsakType === a.key ? 600 : 400,
                          color: arsakType === a.key ? C.navy : C.navyMid,
                        }}
                      >
                        {a.label}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: arsakType === a.key ? "#16A34A" : C.soft,
                          fontWeight: 500,
                        }}
                      >
                        {a.refusjon}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background:
                    arsakType === "sykepleier_syk"
                      ? "#F0FDF4"
                      : arsakType === "kunde_syk"
                        ? C.goldBg
                        : C.greenXL,
                  borderRadius: 9,
                  padding: "10px 13px",
                  marginBottom: 16,
                  border: `1px solid ${
                    arsakType === "sykepleier_syk"
                      ? "rgba(22,163,74,.2)"
                      : arsakType === "kunde_syk"
                        ? "rgba(196,149,106,.3)"
                        : C.border
                  }`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: refusjonFarge, marginBottom: 2 }}>
                  {arsakType === "sykepleier_syk"
                    ? "✓ Full refusjon — EiraNova avlyser"
                    : arsakType === "kunde_syk"
                      ? `Kanselleringsregler: ${KANSELLERING_REGLER.fristTimer}t+ = gratis · under ${KANSELLERING_REGLER.gebyrProsent50}t = 50% · under ${KANSELLERING_REGLER.gebyrProsent100}t = 100%`
                      : arsakType === "tidendring"
                        ? "Ingen refusjon — tidsendring"
                        : arsakType === "bytte_sykepleier"
                          ? "Ingen refusjon — sykepleierbytte"
                          : "Vurderes manuelt etter gjennomgang"}
                </div>
                {arsakType === "sykepleier_syk" && (
                  <div style={{ fontSize: 10, color: C.soft }}>
                    Kunden varsles automatisk. Refusjon via{" "}
                    {oppdrag.betaltVia === "b2b"
                      ? "kreditnota på neste faktura"
                      : oppdrag.betaltVia === "vipps"
                        ? "Vipps API (1-3 dager)"
                        : "Stripe (5-10 dager)"}
                    .
                  </div>
                )}
              </div>
              <div className="stack-sm-1" style={{ marginBottom: 14 }}>
                {(arsakType === "tidendring" || arsakType === "annet") && (
                  <>
                    <div>
                      <label
                        style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}
                      >
                        Ny dato
                      </label>
                      <input
                        value={dato}
                        onChange={(e) => setDato(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: "inherit",
                          background: C.greenXL,
                        }}
                        placeholder="Man 4. mars"
                      />
                    </div>
                    <div>
                      <label
                        style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}
                      >
                        Nytt klokkeslett
                      </label>
                      <input
                        value={tid}
                        onChange={(e) => setTid(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: "inherit",
                          background: C.greenXL,
                        }}
                        placeholder="09:00"
                      />
                    </div>
                  </>
                )}
                {(arsakType === "bytte_sykepleier" || arsakType === "sykepleier_syk") && (
                  <div style={{ gridColumn: "1/-1" }}>
                    <label
                      style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}
                    >
                      Velg ny sykepleier
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {nurses
                        .filter((n) => n.status === "available" || n.status === "on_assignment")
                        .map((n) => (
                          <div
                            key={n.name}
                            onClick={() => setSykepleier(n.name)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 13px",
                              borderRadius: 10,
                              border: `2px solid ${sykepleier === n.name ? C.green : C.border}`,
                              background: sykepleier === n.name ? C.greenXL : "white",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "white",
                                flexShrink: 0,
                              }}
                            >
                              {n.av}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{n.name}</div>
                              <div style={{ fontSize: 10, color: C.soft }}>
                                {n.tittel} · {n.omrade}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 50,
                                background: n.status === "available" ? "#F0FDF4" : C.goldBg,
                                color: n.status === "available" ? "#16A34A" : C.goldDark,
                                fontWeight: 600,
                              }}
                            >
                              {n.status === "available" ? "Ledig" : "På oppdrag"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Notat / utfyllende årsak
                </label>
                <textarea
                  value={arsak}
                  onChange={(e) => setArsak(e.target.value)}
                  rows={3}
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
                  placeholder="Beskriv årsaken kort..."
                />
              </div>
              <div
                style={{
                  background: C.softBg,
                  borderRadius: 9,
                  padding: "10px 13px",
                  marginBottom: 16,
                  fontSize: 10,
                  color: C.navyMid,
                  lineHeight: 1.6,
                }}
              >
                📧 <strong>Automatisk varsling:</strong> {oppdrag.customer} mottar e-post/SMS om endringen.
                Sykepleier varsles via appen.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={saved}
                  className="btn bp"
                  style={{ flex: 1, padding: "11px 0", fontSize: 13, borderRadius: 10 }}
                >
                  {arsakType === "sykepleier_syk" || arsakType === "kunde_syk"
                    ? "🚫 Avlys & varsle"
                    : "✓ Lagre endring & varsle"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "11px 18px",
                    fontSize: 12,
                    borderRadius: 10,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}
          {tab === "historikk" && (
            <div>
              <div style={{ fontSize: 11, color: C.soft, marginBottom: 14 }}>
                Alle endringer logges automatisk og kan ikke slettes (GDPR-sporbarhet).
              </div>
              <div style={{ position: "relative" }}>
                <div
                  style={{ position: "absolute", left: 16, top: 8, bottom: 8, width: 2, background: C.border }}
                />
                {oppdrag.endringer.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, position: "relative" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: i === 0 ? C.greenBg : C.softBg,
                        border: `2px solid ${i === 0 ? C.green : C.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {i === 0 ? "📄" : "✏️"}
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
                        {e.handling}
                      </div>
                      {e.arsak && (
                        <div style={{ fontSize: 11, color: C.soft, marginBottom: 2 }}>Årsak: {e.arsak}</div>
                      )}
                      <div style={{ fontSize: 10, color: C.soft }}>
                        {e.av} · {e.dato}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
