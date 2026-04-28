import { colors } from "@eiranova/ui";

const C = colors;

export default function InnstillingerPage() {
  return (
    <div style={{ padding: 24, fontFamily: "DM Sans, system-ui, sans-serif" }}>
      <h1 className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
        Innstillinger
      </h1>
      <p style={{ fontSize: 13, color: C.soft }}>
        Denne siden migreres i Fase D5 av K-REFACTOR-001.
      </p>
    </div>
  );
}
