"use client";

import { mockKundeNesteAvtale } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { ProfilHeader } from "../KundeProfil/KundeProfil";
import { KundeBdg } from "./KundeBdg";

const C = colors;

export type KundeNav = (id: string, _arg2?: unknown, meta?: { orderId?: string }) => void;

export interface KundeAvtaleDetaljProps {
  onNav: KundeNav;
}

/**
 * Kunde: detalj for neste avtale (prototype ~1378, matcher hjem-header).
 */
export function KundeAvtaleDetalj({ onNav }: KundeAvtaleDetaljProps) {
  const o = mockKundeNesteAvtale();
  if (!o) {
    return (
      <div className="phone fu">
        <ProfilHeader title="Avtaledetaljer" onBack={() => onNav("hjem")} backLabel="Hjem" centerTitle />
        <div className="sa" style={{ padding: 20, textAlign: "center", color: C.soft }}>
          Ingen kommende avtale funnet.
        </div>
      </div>
    );
  }
  const betalt = o.betaltVia === "b2b" ? "B2B faktura" : o.betaltVia === "vipps" ? "Vipps" : "Kort";
  return (
    <div className="phone fu">
      <ProfilHeader title="Avtaledetaljer" onBack={() => onNav("hjem")} backLabel="Hjem" centerTitle />
      <div className="sa" style={{ padding: 14 }}>
        <div className="card cp" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: C.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {o.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                Kommende avtale
              </div>
              <div className="fr" style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
                {o.service}
              </div>
              <div style={{ fontSize: 12, color: C.soft }}>
                {o.date} · kl. {o.time}
              </div>
            </div>
            <KundeBdg status={o.status} />
          </div>
        </div>
        {(
          [
            { l: "Adresse", v: o.address, icon: "📍" },
            { l: "Sykepleier", v: o.nurse, icon: "🩺" },
            { l: "Telefon (kontakt)", v: o.phone, icon: "📞" },
            { l: "Beløp", v: `${o.amount} kr (MVA-unntatt helsetjeneste)`, icon: "💰" },
            { l: "Betaling", v: betalt, icon: "🧾" },
          ] as const
        ).map((r) => (
          <div key={r.l} className="card cp" style={{ marginBottom: 10, padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 9,
                color: C.soft,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              {r.icon} {r.l}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{r.v}</div>
          </div>
        ))}
        <div className="card cp" style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Siste aktivitet</div>
          {(o.endringer || []).slice(-2).map((e, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: C.navyMid,
                padding: "6px 0",
                borderTop: i ? `1px solid ${C.border}` : "none",
              }}
            >
              <span style={{ color: C.soft }}>{e.dato}</span> — {e.handling}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
