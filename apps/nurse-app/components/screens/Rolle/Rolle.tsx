"use client";

import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const C = colors;

export function Rolle() {
  const router = useRouter();
  const [isNy] = useState(true);

  return (
    <div className="phone fu">
      <div
        style={{
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          padding: "clamp(20px,3vw,40px) clamp(20px,3vw,40px) clamp(16px,2vw,28px)",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            className="fr"
            style={{
              fontSize: "clamp(18px,2vw,24px)",
              fontWeight: 600,
              color: "white",
              marginBottom: 4,
            }}
          >
            God morgen, Sara! 👋
          </div>
          <div style={{ fontSize: "clamp(11px,1.2vw,14px)", color: "rgba(255,255,255,.6)" }}>
            Hvilken rolle jobber du i dag?
          </div>
        </div>
      </div>
      <div className="sa" style={{ padding: "clamp(16px,3vw,40px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {(
            [
              {
                role: "sykepleier",
                label: "Sykepleier / Hjelpepleier",
                sub: "Hjemmebesøk og pasientoppfølging",
                icon: "🩺",
                screen: "nurse-hjem",
              },
              {
                role: "admin",
                label: "Koordinator / Admin",
                sub: "Oppdragsplanlegging og oversikt — åpner adminpanelet",
                icon: "🗂️",
                screen: "admin-redirect",
              },
            ] as const
          ).map((r) => (
            <div
              key={r.role}
              onClick={() => {
                if (r.screen === "admin-redirect") {
                  // I monorepo-konteksten: admin er eget Next.js-prosjekt (admin.eiranova.no), ikke en rute i nurse-app.
                  // Full URL-redirect — ikke router.push (permanent 404). Mønster/env: D-028.
                  const adminBaseUrl =
                    process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.eiranova.no";
                  if (typeof window !== "undefined") {
                    window.location.href = adminBaseUrl;
                  }
                } else if (r.role === "sykepleier" && isNy) {
                  router.push("/onboarding");
                } else {
                  router.push("/");
                }
              }}
              className="card"
              style={{
                padding: "clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)",
                display: "flex",
                alignItems: "center",
                gap: "clamp(12px,1.5vw,18px)",
                marginBottom: 12,
                cursor: "pointer",
                transition: "border-color .15s, transform .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.green;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.transform = "";
              }}
            >
              <div
                style={{
                  width: "clamp(44px,5vw,56px)",
                  height: "clamp(44px,5vw,56px)",
                  borderRadius: 12,
                  background: C.greenBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(22px,2.5vw,28px)",
                  flexShrink: 0,
                }}
              >
                {r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "clamp(13px,1.4vw,16px)",
                    fontWeight: 600,
                    color: C.navy,
                    marginBottom: 3,
                  }}
                >
                  {r.label}
                </div>
                <div style={{ fontSize: "clamp(10px,1vw,12px)", color: C.soft }}>{r.sub}</div>
              </div>
              <span style={{ color: C.soft, fontSize: 20 }}>›</span>
            </div>
          ))}
          <div
            style={{
              marginTop: 16,
              padding: "clamp(10px,1.5vw,16px)",
              background: C.softBg,
              borderRadius: 10,
              fontSize: "clamp(10px,1vw,12px)",
              color: C.soft,
              lineHeight: 1.6,
            }}
          >
            💡 Koordinator/Admin-rollen åpner adminpanelet. Velg sykepleier-rollen for daglig arbeidsdag og
            pasientoppfølging.
          </div>
        </div>
      </div>
    </div>
  );
}
