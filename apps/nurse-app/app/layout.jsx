import { EnvBadge } from "@/components/EnvBadge";

export const metadata = {
  title: "EiraNova Sykepleier",
  description: "EiraNova sykepleier-app prototype"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body style={{ margin: 0 }}>
        {children}
        <EnvBadge />
      </body>
    </html>
  );
}
