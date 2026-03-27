export const metadata = {
  title: "EiraNova Kunde",
  description: "EiraNova kunde-app prototype"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
