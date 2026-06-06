"use client";

import type { TjenesteInstruks } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

const C = colors;

export interface InstruktionEditorProps {
  instruks: TjenesteInstruks;
  onChange: (instruks: TjenesteInstruks) => void;
  tjenestNavn: string;
}

export function InstruktionEditor({ instruks, onChange, tjenestNavn }: InstruktionEditorProps) {
  const [vis, setVis] = useState(false);
  const [fane, setFane] = useState<"kunde" | "sykepleier" | "lister">("kunde");
  const [inkl, setInkl] = useState("");
  const [ikkeInkl, setIkkeInkl] = useState("");

  const upd = (felt: "kundeversjon" | "sykepleiersjon", val: string) =>
    onChange({ ...instruks, [felt]: val, endretDato: new Date().toISOString().slice(0, 10) });

  const addInkl = (type: "inkl" | "ikkeinkl", val: string) => {
    if (!val.trim()) return;
    const key = type === "inkl" ? "inkluderer" : "inkludererIkke";
    onChange({
      ...instruks,
      [key]: [...(instruks[key] ?? []), val.trim()],
      endretDato: new Date().toISOString().slice(0, 10),
    });
    if (type === "inkl") setInkl("");
    else setIkkeInkl("");
  };

  const removeInkl = (type: "inkl" | "ikkeinkl", idx: number) => {
    const key = type === "inkl" ? "inkluderer" : "inkludererIkke";
    onChange({
      ...instruks,
      [key]: (instruks[key] ?? []).filter((_, i) => i !== idx),
      endretDato: new Date().toISOString().slice(0, 10),
    });
  };

  const harInstruks = Boolean(instruks?.kundeversjon || instruks?.sykepleiersjon);

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: vis ? 12 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>📋 Tjenesteinstruks</span>
          {harInstruks ? (
            <span
              style={{
                fontSize: 9,
                background: "#F0FDF4",
                color: "#16A34A",
                padding: "2px 8px",
                borderRadius: 50,
                fontWeight: 600,
              }}
            >
              ✓ Opprettet v{instruks?.versjon ?? 1}
            </span>
          ) : (
            <span
              style={{
                fontSize: 9,
                background: C.goldBg,
                color: C.goldDark,
                padding: "2px 8px",
                borderRadius: 50,
                fontWeight: 600,
              }}
            >
              ⚠ Mangler
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setVis((v) => !v)}
          style={{
            fontSize: 10,
            padding: "4px 12px",
            background: vis ? C.softBg : C.greenBg,
            color: vis ? C.soft : C.green,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          {vis ? "Skjul ▲" : "Rediger ▼"}
        </button>
      </div>

      {!vis && !harInstruks && (
        <div
          style={{
            background: "#FFF3E0",
            borderRadius: 8,
            padding: "8px 12px",
            marginTop: 8,
            fontSize: 10,
            color: "#92400E",
            lineHeight: 1.6,
          }}
        >
          Ingen instruks opprettet. Klikk &quot;Rediger&quot; for å legge til forventninger for kunder og sykepleiere.
        </div>
      )}

      {vis && (
        <div style={{ background: C.greenXL, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.soft, marginBottom: 12, lineHeight: 1.6 }}>
            Instruksen vises til kunden i appen og til sykepleieren i oppdragsoversikten. Den setter forventninger og gir juridisk
            klarhet.
          </div>

          <div
            style={{
              display: "flex",
              background: "white",
              borderRadius: 8,
              padding: 3,
              marginBottom: 14,
              border: `1px solid ${C.border}`,
              width: "fit-content",
            }}
          >
            {(
              [
                ["kunde", "👤 Til kunden"],
                ["sykepleier", "🩺 Til sykepleier"],
                ["lister", "📝 Inkl. / Ikke inkl."],
              ] as const
            ).map(([f, l]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFane(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: fane === f ? 600 : 400,
                  cursor: "pointer",
                  border: "none",
                  background: fane === f ? C.greenBg : "transparent",
                  color: fane === f ? C.green : C.soft,
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {fane === "kunde" && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
                Tekst som vises til kunden i bestillingsbekreftelse og app
              </div>
              <div
                style={{
                  background: "#EFF6FF",
                  borderRadius: 8,
                  padding: "8px 11px",
                  fontSize: 9,
                  color: "#1e40af",
                  marginBottom: 8,
                  lineHeight: 1.5,
                }}
              >
                💡 Bruk et enkelt, vennlig språk. Unngå fagtermer. Fokuser på hva kunden kan forvente — ikke hva sykepleieren gjør.
              </div>
              <textarea
                value={instruks?.kundeversjon ?? ""}
                onChange={(e) => upd("kundeversjon", e.target.value)}
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 9,
                  fontSize: 12,
                  fontFamily: "inherit",
                  background: "white",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                placeholder={`F.eks. "Du mottar hjelp til ${tjenestNavn || "tjenesten"} i ditt eget tempo. Sykepleieren er der for deg — ikke for å stresse deg..."`}
              />
              <div style={{ fontSize: 9, color: C.soft, marginTop: 4, textAlign: "right" }}>
                {(instruks?.kundeversjon ?? "").length} tegn
              </div>
            </div>
          )}

          {fane === "sykepleier" && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
                Faglig instruks til sykepleier — vises i oppdragskortet
              </div>
              <div
                style={{
                  background: "#F0FDF4",
                  borderRadius: 8,
                  padding: "8px 11px",
                  fontSize: 9,
                  color: "#166534",
                  marginBottom: 8,
                  lineHeight: 1.5,
                }}
              >
                💡 Vær konkret og faglig. Inkluder dokumentasjonskrav, sikkerhetspunkter og hva som skal rapporteres.
              </div>
              <textarea
                value={instruks?.sykepleiersjon ?? ""}
                onChange={(e) => upd("sykepleiersjon", e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 9,
                  fontSize: 12,
                  fontFamily: "inherit",
                  background: "white",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                placeholder="F.eks. Gjennomfør fullt morgenstell inkl. dusj/vask, tannpuss og påkledning. Dokumenter hudtilstand ved avvik..."
              />
              <div style={{ fontSize: 9, color: C.soft, marginTop: 4, textAlign: "right" }}>
                {(instruks?.sykepleiersjon ?? "").length} tegn
              </div>
            </div>
          )}

          {fane === "lister" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#16A34A", marginBottom: 8 }}>✓ Inkludert i tjenesten</div>
                {(instruks?.inkluderer ?? []).map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 9px",
                      background: "#F0FDF4",
                      borderRadius: 7,
                      marginBottom: 5,
                      border: "1px solid rgba(22,163,74,.15)",
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 11, color: "#166534", flex: 1 }}>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInkl("inkl", i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#16A34A",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 2px",
                        opacity: 0.6,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input
                    value={inkl}
                    onChange={(e) => setInkl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addInkl("inkl", inkl)}
                    style={{
                      flex: 1,
                      padding: "6px 9px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    placeholder="F.eks. Dusj eller vask"
                  />
                  <button
                    type="button"
                    onClick={() => addInkl("inkl", inkl)}
                    style={{
                      padding: "6px 10px",
                      background: "#16A34A",
                      color: "white",
                      border: "none",
                      borderRadius: 7,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.danger, marginBottom: 8 }}>✗ Ikke inkludert</div>
                {(instruks?.inkludererIkke ?? []).map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 9px",
                      background: C.dangerBg,
                      borderRadius: 7,
                      marginBottom: 5,
                      border: "1px solid rgba(225,29,72,.1)",
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0, color: C.danger }}>✗</span>
                    <span style={{ fontSize: 11, color: C.danger, flex: 1 }}>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInkl("ikkeinkl", i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: C.danger,
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 2px",
                        opacity: 0.6,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input
                    value={ikkeInkl}
                    onChange={(e) => setIkkeInkl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addInkl("ikkeinkl", ikkeInkl)}
                    style={{
                      flex: 1,
                      padding: "6px 9px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    placeholder="F.eks. Rengjøring av bad"
                  />
                  <button
                    type="button"
                    onClick={() => addInkl("ikkeinkl", ikkeInkl)}
                    style={{
                      padding: "6px 10px",
                      background: C.danger,
                      color: "white",
                      border: "none",
                      borderRadius: 7,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 9, color: C.soft }}>
              {instruks?.endretDato && `Sist endret: ${instruks.endretDato} · `}Versjon {instruks?.versjon ?? 1}
              {instruks?.endretAv && ` · ${instruks.endretAv}`}
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...instruks,
                  versjon: (instruks?.versjon ?? 1) + 1,
                  endretDato: new Date().toISOString().slice(0, 10),
                })
              }
              style={{
                fontSize: 9,
                padding: "3px 10px",
                background: C.softBg,
                color: C.navyMid,
                border: `1px solid ${C.border}`,
                borderRadius: 5,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Bump versjon → v{(instruks?.versjon ?? 1) + 1}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
