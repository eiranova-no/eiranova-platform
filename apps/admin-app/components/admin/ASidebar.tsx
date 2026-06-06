"use client";

import { colors } from "@eiranova/ui";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/useAuth";
import {
  ADMIN_NAV_ITEMS,
  adminNavIdToPath,
  pathnameToAdminNavId,
} from "@/lib/admin/adminNav";

const C = colors;

export interface ASidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ASidebar({ open, onClose }: ASidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = pathnameToAdminNavId(pathname);
  const { signOutMock } = useAuth();

  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`sidebar${open ? "" : " closed"}`}>
        <div
          style={{
            padding: "16px 18px 12px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(74,188,158,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            🤲
          </div>
          <div>
            <div className="fr" style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
              Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)" }}>Adminpanel</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hd"
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,.5)",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        <nav style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 0" }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "10px 18px 4px",
            }}
          >
            Oversikt
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const a = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  router.push(adminNavIdToPath(item.id));
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "11px 18px",
                  background: a ? C.sidebarActive : "transparent",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  borderLeft: `3px solid ${a ? C.sidebarAccent : "transparent"}`,
                  color: a ? "white" : C.sidebarText,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16, opacity: a ? 1 : 0.75 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div
          style={{
            marginTop: "auto",
            flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,.08)",
            padding: "12px 18px",
            paddingBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: C.sidebarAccent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              LA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Lise Andersen</div>
              <div style={{ fontSize: 10, color: C.sidebarMuted }}>Administrator</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              signOutMock();
              onClose();
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(255,255,255,.12)",
              color: "white",
              border: "1px solid rgba(255,255,255,.22)",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Logg ut
          </button>
        </div>
      </aside>
    </>
  );
}
