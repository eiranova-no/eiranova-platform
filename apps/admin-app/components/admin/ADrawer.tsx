"use client";

import { colors } from "@eiranova/ui";

import { ModalPortal } from "./ModalPortal";

const C = colors;

export type ADrawerType = "oppdrag" | "b2b";

export interface ADrawerProps {
  type: ADrawerType | null;
  onClose: () => void;
}

export function ADrawer({ type, onClose }: ADrawerProps) {
  if (!type) return null;
  const fields =
    type === "b2b"
      ? [
          ["Organisasjonsnummer", "922456789"],
          ["Firmanavn", "Automatisk utfylt"],
          ["Kundetype", "Kommune / Borettslag / Bedrift"],
          ["Kontakt e-post", "faktura@bedrift.no"],
          ["Betalingsfrist", "14 / 30 dager"],
        ]
      : [
          ["Pasient", "Søk eller velg kunde..."],
          ["Tjeneste", "Velg tjeneste..."],
          ["Dato", "Velg dato..."],
          ["Sykepleier", "Tildel (valgfritt)"],
        ];

  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.42)", padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "18px 18px 28px",
          width: "100%",
          maxWidth: 540,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
            {type === "b2b" ? "Legg til B2B-kunde" : "Nytt oppdrag"}
          </span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.soft }}>
            ✕
          </button>
        </div>
        {fields.map(([label, ph]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>
              {label}
            </label>
            <input className="inp" placeholder={ph} />
          </div>
        ))}
        {type === "b2b" && (
          <div
            style={{
              marginBottom: 12,
              background: C.greenBg,
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 11,
              color: C.greenDark,
            }}
          >
            ✓ Registrert i ELMA — EHF-faktura sendes automatisk via PEPPOL
          </div>
        )}
        <button type="button" onClick={onClose} className="btn bp bf" style={{ borderRadius: 10 }}>
          {type === "b2b" ? "Legg til kunde" : "Opprett oppdrag"}
        </button>
      </div>
    </ModalPortal>
  );
}
