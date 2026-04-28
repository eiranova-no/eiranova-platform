"use client";

import { useState } from "react";

import { ADrawer } from "@/components/admin/ADrawer";
import { AHeader } from "@/components/admin/AHeader";
import { ASidebar } from "@/components/admin/ASidebar";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"oppdrag" | "b2b" | null>(null);

  return (
    <div className="al">
      <ASidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="am">
        <AHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="ac">{children}</div>
      </div>
      <ADrawer type={drawerType} onClose={() => setDrawerType(null)} />
    </div>
  );
}
