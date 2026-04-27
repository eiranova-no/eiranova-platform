import type { Metadata } from "next";
import "@eiranova/ui/styles/global.css";
import { EnvBadge } from "@/components/EnvBadge";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: "EiraNova Kunde",
  description: "EiraNova kunde-app",
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body style={{ margin: 0 }}>
        <AuthProvider>{children}</AuthProvider>
        <EnvBadge />
      </body>
    </html>
  );
}
