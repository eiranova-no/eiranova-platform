"use client";

import { useState } from "react";

import type { MockOrder } from "@eiranova/mock-data";
import { TOAST_AVBESTILLING_BEKREFTET, kundeAvbestiltRefusjonInfotekst, kundeKanAvbestilleSelv, kundeMaKontakteForAvbestilling, kundeOrdreHistorisk } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { useLandingToast } from "../Landing/useLandingToast";
import { ProfilHeader } from "../KundeProfil/KundeProfil";
import { KundeAvbestillBekreftModal } from "./KundeAvbestillBekreftModal";
import { KundeBdg } from "./KundeBdg";
import type { KundeNav } from "./KundeAvtaleDetalj";

const C = colors;

export interface KundeOppdragDetaljProps {
  orderId: string;
  orders: MockOrder[];
  onNav: KundeNav;
  onKundeOrderAvbestill?: (orderId: string) => void;
}

/**
 * Kunde: bestillingsdetalj (prototype ~2540).
 */
export function KundeOppdragDetalj({ orderId, orders, onNav, onKundeOrderAvbestill }: KundeOppdragDetaljProps) {
  const { toast, ToastContainer } = useLandingToast();
  const [visAvbestill, setVisAvbestill] = useState(false);
  const o = orders.find((x) => String(x.id) === String(orderId));
  const betaltTekst = o
    ? o.paid
      ? o.betaltVia === "vipps"
        ? "Betalt med Vipps"
        : o.betaltVia === "b2b"
          ? `Betalt via organisasjon${o.b2bOrg ? ` · ${o.b2bOrg}` : ""}`
          : "Betalt"
      : "Ikke betalt"
    : "";

  return (
    <div className="phone fu">
      <ToastContainer />
      <ProfilHeader title="Bestilling" onBack={() => onNav("mine")} backLabel="Mine bestillinger" centerTitle />
      <div className="sa" style={{ padding: 14 }}>
        {!o ? (
          <div className="card cp">
            <div style={{ fontSize: 13, color: C.soft }}>Fant ikke bestillingen.</div>
          </div>
        ) : (
          <>
            <div className="card cp" style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}
              >
                Tjeneste
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{o.service}</div>
            </div>
            <div className="card cp" style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}
              >
                Dato og tid
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                {o.date} · kl. {o.time}
              </div>
            </div>
            <div className="card cp" style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}
              >
                Sykepleier
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{o.nurse}</div>
            </div>
            <div className="card cp" style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}
              >
                Status
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <KundeBdg status={o.status} />
              </div>
            </div>
            <div className="card cp" style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}
              >
                Beløp
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.green }}>{o.amount.toLocaleString("nb-NO")} kr</div>
              <div style={{ fontSize: 11, color: C.navyMid, marginTop: 4 }}>{betaltTekst}</div>
              {o.status === "no_show" && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "9px 11px",
                    background: C.softBg,
                    borderRadius: 8,
                    flexShrink: 0,
                    fontSize: 11,
                    color: C.navyMid,
                    lineHeight: 1.5,
                  }}
                >
                  Ved uteblivelse (no-show) gis det ikke refusjon.
                </div>
              )}
              {o.status === "cancelled" && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "9px 11px",
                    background: C.greenXL,
                    borderRadius: 8,
                    border: "1px solid rgba(74,124,111,.22)",
                    fontSize: 11,
                    color: C.navyMid,
                    lineHeight: 1.55,
                  }}
                >
                  {kundeAvbestiltRefusjonInfotekst(o)}
                </div>
              )}
            </div>
            {!kundeOrdreHistorisk(o) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kundeKanAvbestilleSelv(o) && onKundeOrderAvbestill && (
                  <button
                    type="button"
                    onClick={() => setVisAvbestill(true)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: "white",
                      color: C.danger,
                      border: `1.5px solid ${C.danger}`,
                    }}
                  >
                    Avbestill
                  </button>
                )}
                {kundeMaKontakteForAvbestilling(o) && (
                  <button
                    type="button"
                    onClick={() => onNav("chat-kunde")}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: C.greenBg,
                      color: C.greenDark,
                      border: `1.5px solid ${C.border}`,
                    }}
                  >
                    Kontakt oss
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {visAvbestill && o && onKundeOrderAvbestill && (
        <KundeAvbestillBekreftModal
          order={o}
          onLukk={() => setVisAvbestill(false)}
          onBekreft={() => {
            onKundeOrderAvbestill(o.id);
            setVisAvbestill(false);
            toast(TOAST_AVBESTILLING_BEKREFTET, "ok");
          }}
        />
      )}
    </div>
  );
}
