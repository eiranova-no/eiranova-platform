import { env } from "@/lib/env";

function appEnvLabel(value: string): string {
  const map: Record<string, string> = {
    development: "Local",
    preview: "Preview",
    feature: "Feature",
    production: "Production",
  };
  return map[value] ?? value;
}

function dataSourceLabel(dataSource: string): string {
  if (dataSource === "dev") return "Supabase-Dev";
  if (dataSource === "prod") return "Supabase-Prod";
  return dataSource;
}

export function EnvBadge() {
  if (env.APP_ENV === "production") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        padding: "6px 12px 10px",
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontFamily:
            "ui-sans-serif, system-ui, 'DM Sans', 'Segoe UI', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: "#1A2E24",
          background: "rgba(196, 149, 106, 0.35)",
          border: "1px solid rgba(74, 188, 158, 0.6)",
          borderRadius: "6px",
          padding: "4px 10px",
          boxShadow: "0 1px 4px rgba(26, 46, 36, 0.12)",
        }}
        aria-label="Miljømerke: ikke produksjon"
      >
        ENV: {appEnvLabel(env.APP_ENV)} &nbsp;|&nbsp; DATA:{" "}
        {dataSourceLabel(env.DATA_SOURCE)}
      </div>
    </div>
  );
}
