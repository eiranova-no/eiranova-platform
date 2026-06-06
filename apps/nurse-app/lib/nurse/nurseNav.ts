/**
 * Nurse bottom + desktop nav — aligned with prototype NURSE_NAV / screen ids.
 *
 * Scope: kun nurse-app-interne stier (`/` … `/profil`). Cross-app (f.eks. admin på
 * admin.eiranova.no) håndteres ikke her — bruk full URL / `window.location.href`
 * punktvis (se Rolle.tsx, D-028).
 */

export interface NurseNavItem {
  id: string;
  icon: string;
  label: string;
}

export const NURSE_NAV_ITEMS: readonly NurseNavItem[] = [
  { id: "nurse-hjem", icon: "🏠", label: "Hjem" },
  { id: "nurse-oppdrag", icon: "📋", label: "Oppdrag" },
  { id: "nurse-innsjekk", icon: "✅", label: "Innsjekk" },
  { id: "nurse-profil", icon: "👤", label: "Profil" },
];

export function nurseNavIdToPath(navId: string): string {
  const map: Record<string, string> = {
    "nurse-hjem": "/",
    "nurse-oppdrag": "/oppdrag",
    "nurse-innsjekk": "/innsjekk",
    "nurse-profil": "/profil",
  };
  return map[navId] ?? "/";
}

/** Resolve active prototype nav id from App Router pathname. */
export function pathnameToNurseNavId(pathname: string): string {
  if (pathname === "/" || pathname === "") return "nurse-hjem";
  if (pathname.startsWith("/oppdrag")) return "nurse-oppdrag";
  if (pathname.startsWith("/innsjekk")) return "nurse-innsjekk";
  if (pathname.startsWith("/profil")) return "nurse-profil";
  return "";
}
