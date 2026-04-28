"use client";

import { colors } from "@eiranova/ui";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ADMIN_NAV_ITEMS, pathnameToAdminNavId } from "@/lib/admin/adminNav";

const C = colors;

export interface AHeaderProps {
  onMenuClick: () => void;
}

export function AHeader({ onMenuClick }: AHeaderProps) {
  const pathname = usePathname();
  const navId = pathnameToAdminNavId(pathname);
  const [showStatus, setShowStatus] = useState(false);
  const name = ADMIN_NAV_ITEMS.find((n) => n.id === navId)?.label ?? "Dashboard";
  const services = [
    { label: "Vipps MobilePay", ok: true },
    { label: "Stripe", ok: true },
    { label: "Supabase", ok: true },
    { label: "Google Workspace", ok: true },
    { label: "Fiken/EHF", ok: true },
  ];

  return (
    <header className="ah" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={onMenuClick}
        className="hbg btn"
        style={{
          width: 36,
          height: 36,
          background: C.greenBg,
          borderRadius: 8,
          fontSize: 18,
          flexShrink: 0,
          border: `1px solid ${C.border}`,
        }}
      >
        ☰
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
          {name}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowStatus((s) => !s)}
            title="Systemstatus"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: showStatus ? C.greenBg : "white",
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              position: "relative",
            }}
          >
            <span>⚙️</span>
            <div
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#16A34A",
                border: "1.5px solid white",
              }}
            />
          </button>
          {showStatus && (
            <div
              style={{
                position: "absolute",
                top: 42,
                right: 0,
                background: "white",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                width: 220,
                boxShadow: "0 4px 20px rgba(0,0,0,.12)",
                zIndex: 50,
              }}
            >
              <div className="fr" style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
                ⚙️ Systemstatus
              </div>
              {services.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: C.navy }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 600 }}>✓ OK</span>
                </div>
              ))}
              <div style={{ fontSize: 9, color: C.soft, marginTop: 8, textAlign: "center" }}>
                Powered by CoreX · EiraNova
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: C.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          🔔
        </div>
      </div>
    </header>
  );
}
