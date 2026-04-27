"use client";

import type { MockOrder } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { ModalPortal } from "../Landing/ModalPortal";

const C = colors;

export interface KundeAvbestillBekreftModalProps {
  order: MockOrder | null;
  onLukk: () => void;
  onBekreft: () => void;
}

/**
 * Kunde: bekreft avbestilling (prototype ~2522).
 */
export function KundeAvbestillBekreftModal({ order, onLukk, onBekreft }: KundeAvbestillBekreftModalProps) {
  if (!order) return null;
  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 16 }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          maxWidth: 380,
          width: "100%",
          padding: "22px 20px",
          boxShadow: "0 16px 48px rgba(0,0,0,.18)",
        }}
      >
        <div className="fr" style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
          Avbestille?
        </div>
        <p style={{ fontSize: 12, color: C.navyMid, lineHeight: 1.6, margin: 0, marginBottom: 18 }}>
          Er du sikker? Du vil få full refusjon innen 3–5 virkedager til betalingsmetoden du brukte.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onLukk}
            className="btn"
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "white",
              color: C.navy,
              border: `1.5px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={onBekreft}
            className="btn"
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: C.danger,
              color: "white",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Bekreft avbestilling
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
