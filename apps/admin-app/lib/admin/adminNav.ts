export type AdminNavId =
  | "dashboard"
  | "oppdrag"
  | "betalinger"
  | "b2b"
  | "ansatte"
  | "okonomi"
  | "tjenester"
  | "innstillinger";

export interface AdminNavItem {
  id: AdminNavId;
  icon: string;
  label: string;
}

/** Speiler ANAV i prototype linje 3386–3395. Pixel-parity. */
export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "oppdrag", icon: "📋", label: "Oppdrag" },
  { id: "betalinger", icon: "💳", label: "Betalinger" },
  { id: "b2b", icon: "🏢", label: "B2B & Faktura" },
  { id: "ansatte", icon: "👥", label: "Ansatte & Roller" },
  { id: "okonomi", icon: "📊", label: "Økonomi & Regnskap" },
  { id: "tjenester", icon: "🏥", label: "Tjenester & priser" },
  { id: "innstillinger", icon: "⚙️", label: "Innstillinger" },
];

export function adminNavIdToPath(id: AdminNavId): string {
  return `/${id}`;
}

export function pathnameToAdminNavId(pathname: string): AdminNavId | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return null;
  const item = ADMIN_NAV_ITEMS.find((i) => i.id === seg);
  return item?.id ?? null;
}
