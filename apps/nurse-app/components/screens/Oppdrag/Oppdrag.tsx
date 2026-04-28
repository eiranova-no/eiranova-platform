"use client";

import { OPPDRAG } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

import { NurseBottomNav } from "@/components/NurseBottomNav";
import { Bdg } from "@/components/nurse/Bdg";
import { NurseDeskNav } from "@/components/nurse/NurseDeskNav";

const C = colors;

export function Oppdrag() {
  const router = useRouter();

  const deskRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.soft, flexShrink: 0 }}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: C.sidebarAccent,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "white",
        }}
      >
        SL
      </span>
      <span className="hm" style={{ whiteSpace: "nowrap" }}>
        Sara Lindgren
      </span>
    </div>
  );

  return (
    <div className="phone fu">
      <NurseDeskNav active="nurse-oppdrag" title="EiraNova · Sara Lindgren" right={deskRight} />
      <div
        style={{
          padding: "clamp(14px,2vw,24px) clamp(14px,3vw,32px)",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="fr" style={{ fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 600, color: "white", marginBottom: 4 }}>
            Dagens oppdrag
          </div>
          <div style={{ fontSize: "clamp(10px,1vw,13px)", color: "rgba(255,255,255,.65)" }}>
            Mandag 3. mars · {OPPDRAG.length} oppdrag
          </div>
        </div>
      </div>
      <div className="sa" style={{ padding: "clamp(13px,2vw,28px) clamp(13px,3vw,32px)" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,420px),1fr))",
            gap: 12,
          }}
        >
          {OPPDRAG.map((op) => (
            <div
              key={op.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/innsjekk?id=${encodeURIComponent(op.id)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/innsjekk?id=${encodeURIComponent(op.id)}`);
                }
              }}
              className="nc"
              style={{ cursor: "pointer", opacity: op.status === "completed" ? 0.65 : 1 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: op.cat === "barsel" ? C.goldBg : C.greenBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {op.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 600, color: C.navy }}>{op.customer}</span>
                    <Bdg status={op.status} />
                  </div>
                  <div style={{ fontSize: "clamp(10px,1vw,12px)", color: C.soft, marginBottom: 3 }}>{op.service}</div>
                  <div style={{ fontSize: "clamp(10px,1vw,12px)", color: C.navyMid }}>
                    🕐 {op.date} kl. {op.time}
                  </div>
                  <div style={{ fontSize: "clamp(10px,1vw,12px)", color: C.soft, marginTop: 4, lineHeight: 1.45 }}>
                    📍 {op.address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NurseBottomNav />
    </div>
  );
}
