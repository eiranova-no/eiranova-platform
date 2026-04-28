"use client";

import { colors } from "@eiranova/ui";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { NURSE_NAV_ITEMS, nurseNavIdToPath, pathnameToNurseNavId } from "@/lib/nurse/nurseNav";

const C = colors;

export function NurseBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const activeId = useMemo(() => pathnameToNurseNavId(pathname ?? ""), [pathname]);

  return (
    <nav className="bnav">
      {NURSE_NAV_ITEMS.map((it) => (
        <button
          type="button"
          key={it.id + it.label}
          className="bi"
          onClick={() => router.push(nurseNavIdToPath(it.id))}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden>
            {it.icon}
          </span>
          <span
            className="bi-lbl"
            style={{ fontWeight: activeId === it.id ? 600 : 400, color: activeId === it.id ? C.green : C.soft }}
          >
            {it.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
