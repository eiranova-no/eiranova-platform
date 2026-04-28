import { colors } from "@eiranova/ui";

const C = colors;

export default function OppdragPage() {
  return (
    <div style={{ padding: 24, fontFamily: "DM Sans, system-ui, sans-serif" }}>
      <h1 className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
        Oppdrag
      </h1>
      <p style={{ fontSize: 13, color: C.soft }}>
        Denne siden migreres i Fase D2 av K-REFACTOR-001.
      </p>
    </div>
  );
}
