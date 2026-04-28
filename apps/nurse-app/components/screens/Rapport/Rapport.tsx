"use client";

import { OPPDRAG } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

import { Bdg } from "@/components/nurse/Bdg";
import { NursePhoneHeader } from "@/components/nurse/NursePhoneHeader";

const C = colors;

const STATS: ReadonlyArray<readonly [string, string, string]> = [
  ["✅", "4", "Fullførte"],
  ["⏱️", "6,5t", "Timer"],
  ["💰", "1 660 kr", "Fakturert"],
  ["⭐", "5/5", "Score"],
];

export function Rapport() {
  const router = useRouter();

  return (
    <div className="phone fu">
      <NursePhoneHeader title="Dagsrapport" onBack={() => router.push("/")} />
      <div className="sa" style={{ padding: 13 }}>
        <div className="g2" style={{ marginBottom: 12 }}>
          {STATS.map(([icon, val, label]) => (
            <div key={label} className="card cp" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
                {val}
              </div>
              <div style={{ fontSize: 9, color: C.soft }}>{label}</div>
            </div>
          ))}
        </div>
        {OPPDRAG.map((op, i) => (
          <div key={op.id} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    op.status === "completed" || op.status === "active" ? C.green : C.border,
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              {i < OPPDRAG.length - 1 && (
                <div style={{ width: 1.5, flex: 1, background: C.border, marginTop: 2 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div style={{ fontSize: 10, color: C.soft, marginBottom: 2 }}>{op.time}</div>
              <div className="card cp" style={{ padding: "9px 11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{op.customer}</div>
                    <div style={{ fontSize: 10, color: C.soft }}>{op.service}</div>
                  </div>
                  <Bdg status={op.status} />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="btn bp bf"
          style={{ borderRadius: 11, marginTop: 4 }}
        >
          Send dagsrapport
        </button>
      </div>
    </div>
  );
}
