"use client";

import { useState } from "react";

import { ADrawer } from "@/components/admin/ADrawer";
import { AHeader } from "@/components/admin/AHeader";
import { ASidebar } from "@/components/admin/ASidebar";
import { AdminDrawerProvider, useAdminDrawer } from "@/lib/admin/AdminDrawerContext";

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { drawerType, closeDrawer } = useAdminDrawer();

  return (
    <div className="al">
      <ASidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="am">
        <AHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="ac">{children}</div>
      </div>
      <ADrawer type={drawerType} onClose={closeDrawer} />
    </div>
  );
}

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDrawerProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminDrawerProvider>
  );
}
