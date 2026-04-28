"use client";

import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

import { NURSE_NAV_ITEMS, nurseNavIdToPath } from "@/lib/nurse/nurseNav";

const C = colors;

interface NurseDeskNavProps {
  active: string;
  title?: React.ReactNode;
  right?: React.ReactNode;
}

export function NurseDeskNav({ active, title, right }: NurseDeskNavProps) {
  const router = useRouter();

  return (
    <nav className="desk-nav">
      {title ? (
        <div
          className="fr"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.navy,
            marginRight: 16,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            maxWidth: "min(280px,42vw)",
            flex: "0 1 auto",
          }}
        >
          {title}
        </div>
      ) : null}
      {NURSE_NAV_ITEMS.map((it) => (
        <button
          key={it.id + it.label}
          type="button"
          className={`desk-nav-item${active === it.id ? " on" : ""}`}
          onClick={() => router.push(nurseNavIdToPath(it.id))}
        >
          <span style={{ marginRight: 5, fontSize: 14 }}>{it.icon}</span>
          {it.label}
        </button>
      ))}
      {right ? (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>{right}</div>
      ) : null}
    </nav>
  );
}
