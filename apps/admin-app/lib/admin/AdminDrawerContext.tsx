"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AdminDrawerType = "oppdrag" | "b2b" | null;

interface AdminDrawerContextValue {
  drawerType: AdminDrawerType;
  openDrawer: (type: Exclude<AdminDrawerType, null>) => void;
  closeDrawer: () => void;
}

const AdminDrawerContext = createContext<AdminDrawerContextValue | null>(null);

export function AdminDrawerProvider({ children }: { children: ReactNode }) {
  const [drawerType, setDrawerType] = useState<AdminDrawerType>(null);
  return (
    <AdminDrawerContext.Provider
      value={{
        drawerType,
        openDrawer: (type) => setDrawerType(type),
        closeDrawer: () => setDrawerType(null),
      }}
    >
      {children}
    </AdminDrawerContext.Provider>
  );
}

export function useAdminDrawer(): AdminDrawerContextValue {
  const ctx = useContext(AdminDrawerContext);
  if (!ctx) throw new Error("useAdminDrawer must be used inside AdminDrawerProvider");
  return ctx;
}
