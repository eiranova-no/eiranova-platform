"use client";

import { NURSES, ORDERS } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { Bdg } from "@/components/admin/Bdg";

const C = colors;

interface KpiItem {
  label: string;
  value: string;
  icon: string;
  delta: string;
  pos?: boolean;
}

const KPIS: ReadonlyArray<KpiItem> = [
  { label: "Oppdrag i dag", value: "12", icon: "📋", delta: "+2 fra i går", pos: true },
  { label: "Aktive sykepleiere", value: "4/6", icon: "🩺", delta: "2 på pause" },
  { label: "Omsetning (mtd)", value: "84 350 kr", icon: "💰", delta: "+18%", pos: true },
  { label: "Kundetilfredsh.", value: "4.9/5", icon: "⭐", delta: "Stabil" },
];

const REVENUE_BARS = [42, 68, 55, 80, 73, 90, 84] as const;
const REVENUE_LABELS = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"] as const;

export function Dashboard() {
  const nurses = NURSES;
  return (
    <div className="fu">
      <div className="g4" style={{ marginBottom: 18 }}>
        {KPIS.map((k) => (
          <div key={k.label} className="card cp">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.soft,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {k.label}
              </span>
              <span style={{ fontSize: 18 }}>{k.icon}</span>
            </div>
            <div className="fr" style={{ fontSize: 22, fontWeight: 600, color: C.navy, marginBottom: 3 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 10, color: k.pos ? C.green : C.soft }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="g2 g2m1" style={{ marginBottom: 18 }}>
        <div className="card">
          <div
            className="fr"
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${C.border}`,
              fontSize: 14,
              fontWeight: 600,
              color: C.navy,
            }}
          >
            Oppdrag i dag
          </div>
          {ORDERS.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderBottom: `0.5px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 14 }}>{o.service.split(" ")[0]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.navy,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {o.customer}
                </div>
                <div style={{ fontSize: 9, color: C.soft }}>
                  {o.time} · {o.nurse}
                </div>
              </div>
              <Bdg status={o.status} />
            </div>
          ))}
        </div>
        <div className="card">
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${C.border}`,
              fontFamily: "'Fraunces',serif",
              fontSize: 14,
              fontWeight: 600,
              color: C.navy,
            }}
          >
            Sykepleiere nå
          </div>
          {nurses.map((n) => (
            <div
              key={n.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderBottom: `0.5px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.greenDark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {n.av}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{n.name}</div>
                <div
                  style={{
                    fontSize: 9,
                    color: C.soft,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {n.current}
                </div>
              </div>
              <Bdg status={n.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="card cp">
        <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
          Inntekt siste 7 dager
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 70 }}>
          {REVENUE_BARS.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div
                style={{
                  width: "100%",
                  background: i === 6 ? C.green : C.greenBg,
                  borderRadius: "4px 4px 0 0",
                  height: `${v}%`,
                  minHeight: 4,
                }}
              />
              <div style={{ fontSize: 8, color: C.soft }}>{REVENUE_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
