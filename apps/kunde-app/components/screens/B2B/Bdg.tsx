"use client";

import { colors } from "@eiranova/ui";

const C = colors;

export function Bdg({ status }: { status: string }) {
  const M: Record<string, { l: string; bg: string; c: string }> = {
    completed: { l: "✓ Fullført", bg: C.greenBg, c: C.greenDark },
    active: { l: "● Aktiv", bg: C.greenBg, c: C.green },
    assigned: { l: "Tildelt", bg: C.skyBg, c: C.sky },
    confirmed: { l: "Bekreftet", bg: C.goldBg, c: C.goldDark },
    pending: { l: "Venter", bg: C.goldBg, c: C.goldDark },
    sent: { l: "Sendt", bg: C.skyBg, c: C.sky },
    overdue: { l: "⚠ Forfalt", bg: C.dangerBg, c: C.danger },
    paid: { l: "✓ Betalt", bg: C.greenBg, c: C.greenDark },
    upcoming: { l: "Kommende", bg: C.softBg, c: C.soft },
    on_assignment: { l: "● Aktiv", bg: C.greenBg, c: C.green },
    available: { l: "Ledig", bg: "#F0FDF4", c: "#16A34A" },
    break: { l: "Pause", bg: C.goldBg, c: C.goldDark },
    settled: { l: "✓ Innbetalt", bg: C.greenBg, c: C.greenDark },
    in_transit: { l: "→ Overføring", bg: C.skyBg, c: C.sky },
    cancelled: { l: "Avbestilt", bg: "#FFF1F2", c: "#BE123C" },
    avlyst: { l: "Avlyst", bg: "#FFF1F2", c: "#BE123C" },
    no_show: { l: "Uteblitt", bg: C.softBg, c: C.soft },
  };
  const b = M[status] ?? { l: status, bg: C.softBg, c: C.soft };
  return (
    <span className="badge" style={{ background: b.bg, color: b.c }}>
      {b.l}
    </span>
  );
}
