"use client";

import type { KundeFacingService } from "@eiranova/mock-data";

import { colors } from "@eiranova/ui";

import { ModalPortal } from "./ModalPortal";

export interface TjenesteMerinfoModalProps {
  service: KundeFacingService | null;
  accent?: string;
  onClose: () => void;
  onFortsett: (s: KundeFacingService) => void;
  fortsettLabel?: string;
}

export function TjenesteMerinfoModal({
  service,
  accent,
  onClose,
  onFortsett,
  fortsettLabel,
}: TjenesteMerinfoModalProps) {
  if (!service) return null;
  const ac = accent || (service.cat === "barsel" ? colors.gold : colors.green);

  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.48)", padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          width: "100%",
          maxWidth: 400,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.22)",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            background: `linear-gradient(135deg,${colors.navy},${colors.greenDark})`,
            borderRadius: "18px 18px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {service.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.25 }}>
                {service.name}
              </div>
              {service.tagline ? (
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.72)",
                    fontStyle: "italic",
                    marginTop: 6,
                    lineHeight: 1.45,
                  }}
                >
                  {service.tagline}
                </div>
              ) : null}
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
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Lukk"
          >
            ×
          </button>
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: colors.soft,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            Hva inngår
          </div>
          {service.inkluderer && service.inkluderer.length ? (
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 12,
                color: colors.navyMid,
                lineHeight: 1.55,
              }}
            >
              {service.inkluderer.map((punkt, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {punkt}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: 12, color: colors.soft, fontStyle: "italic" }}>
              Ingen punkter lagt inn ennå.
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: colors.soft }}>Pris · varighet</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ac }}>
                fra {service.price} kr · {service.duration} min
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 12,
                borderRadius: 10,
                background: "white",
                color: colors.navy,
                border: `1.5px solid ${colors.border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Lukk
            </button>
            <button
              type="button"
              onClick={() => {
                onFortsett(service);
                onClose();
              }}
              className="btn bp"
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 12,
                borderRadius: 10,
                fontFamily: "inherit",
                fontWeight: 600,
                background: ac,
                border: `1px solid ${ac}`,
              }}
            >
              {fortsettLabel || "Fortsett"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
