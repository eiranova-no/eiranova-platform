"use client";

import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";
import { useAdminToast } from "@/components/admin/useAdminToast";

const C = colors;

interface VarselTypeDef {
  key: string;
  label: string;
  ikon: string;
  sub: string;
}

interface Mottaker {
  id: string;
  navn: string;
  epost: string;
  rolle: string;
  varsler: Record<string, boolean>;
  kanal: { epost: boolean; push: boolean; sms: boolean };
  aktiv: boolean;
}

interface Area {
  id: string;
  name: string;
  fylke: string;
  aktiv: boolean;
  apner: string;
  stenges: string;
}

type JournalModus = "ekstern" | "intern";

type MottakerModalState = null | "ny" | Mottaker;
type AreaModalState = null | "ny" | Area;

const VARSEL_TYPER: ReadonlyArray<VarselTypeDef> = [
  { key: "nyBestilling", label: "Ny bestilling", ikon: "📋", sub: "Umiddelbart ved ny ordre" },
  { key: "betaling", label: "Betaling", ikon: "💳", sub: "Mottatt eller feilet (Vipps/Stripe/EHF)" },
  { key: "avvik", label: "Avvik & hendelser", ikon: "⚠️", sub: "SEV1/SEV2 og innsjekk-avvik" },
  { key: "dagrapport", label: "Dagsrapport", ikon: "📊", sub: "Sammendrag kl. 21:00 hver dag" },
  { key: "ukesrapport", label: "Ukesrapport", ikon: "📅", sub: "Sammendrag mandag morgen" },
  { key: "lonn", label: "Lønnskjøring", ikon: "💰", sub: "Bekreftelse og avvik ved lønnskjøring" },
  { key: "vikarVarsel", label: "Vikar-tilkalling", ikon: "🤝", sub: "Ingen vikar funnet innen fristen" },
  { key: "kreditering", label: "Krediteringer", ikon: "↩️", sub: "Refusjon over 1 000 kr godkjent" },
];

function emptyVarsler(): Record<string, boolean> {
  return Object.fromEntries(VARSEL_TYPER.map((v) => [v.key, false]));
}

const INIT_MOTTAKERE: Mottaker[] = [
  {
    id: "m1",
    navn: "Lise Andersen",
    epost: "lise@eiranova.no",
    rolle: "Daglig leder",
    varsler: {
      nyBestilling: true,
      betaling: true,
      avvik: true,
      dagrapport: true,
      ukesrapport: true,
      lonn: true,
      vikarVarsel: true,
      kreditering: true,
    },
    kanal: { epost: true, push: true, sms: false },
    aktiv: true,
  },
  {
    id: "m2",
    navn: "Ko-founder 2",
    epost: "partner@eiranova.no",
    rolle: "Medeier",
    varsler: {
      nyBestilling: false,
      betaling: true,
      avvik: true,
      dagrapport: false,
      ukesrapport: true,
      lonn: true,
      vikarVarsel: false,
      kreditering: true,
    },
    kanal: { epost: true, push: false, sms: false },
    aktiv: true,
  },
  {
    id: "m3",
    navn: "Ko-founder 3",
    epost: "founder3@eiranova.no",
    rolle: "Medeier",
    varsler: {
      nyBestilling: false,
      betaling: false,
      avvik: false,
      dagrapport: false,
      ukesrapport: true,
      lonn: true,
      vikarVarsel: false,
      kreditering: false,
    },
    kanal: { epost: true, push: false, sms: false },
    aktiv: true,
  },
];

const INIT_AREAS: Area[] = [
  { id: "moss", name: "Moss", fylke: "Østfold", aktiv: true, apner: "07:00", stenges: "20:00" },
  { id: "fredrikstad", name: "Fredrikstad", fylke: "Østfold", aktiv: true, apner: "07:00", stenges: "20:00" },
  { id: "sarpsborg", name: "Sarpsborg", fylke: "Østfold", aktiv: true, apner: "07:00", stenges: "18:00" },
  { id: "råde", name: "Råde", fylke: "Østfold", aktiv: false, apner: "08:00", stenges: "17:00" },
  { id: "vestby", name: "Vestby", fylke: "Akershus", aktiv: true, apner: "07:00", stenges: "20:00" },
  { id: "ås", name: "Ås", fylke: "Akershus", aktiv: false, apner: "08:00", stenges: "17:00" },
  { id: "ski", name: "Ski", fylke: "Akershus", aktiv: true, apner: "07:00", stenges: "20:00" },
];

export function Innstillinger() {
  const { toast, ToastContainer } = useAdminToast();

  const [mottakere, setMottakere] = useState<Mottaker[]>(() => INIT_MOTTAKERE);
  const [mottakerModal, setMottakerModal] = useState<MottakerModalState>(null);
  const [mottakerForm, setMottakerForm] = useState({
    id: "",
    navn: "",
    epost: "",
    rolle: "",
    varsler: emptyVarsler(),
    kanal: { epost: true, push: false, sms: false },
    aktiv: true,
  });

  const [areas, setAreas] = useState<Area[]>(() => INIT_AREAS);
  const [areaModal, setAreaModal] = useState<AreaModalState>(null);
  const [areaForm, setAreaForm] = useState({
    id: "",
    name: "",
    fylke: "",
    aktiv: true,
    apner: "07:00",
    stenges: "20:00",
  });
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [b2bAktiv, setB2bAktiv] = useState(true);
  const [b2bBekreft, setB2bBekreft] = useState(false);

  const [journalAktiv, setJournalAktiv] = useState(false);
  const [journalModus, setJournalModus] = useState<JournalModus>("ekstern");
  const [journalEksternUrl, setJournalEksternUrl] = useState("");
  const [journalEksternNavn, setJournalEksternNavn] = useState("CGM Pridok");
  const [journalBekreft, setJournalBekreft] = useState(false);

  const [autoPurring1, setAutoPurring1] = useState(true);
  const [autoPurring2, setAutoPurring2] = useState(true);
  const [autoInkasso, setAutoInkasso] = useState(false);

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button
        type="button"
        className="settings-toggle"
        onClick={onToggle}
        aria-pressed={on}
        style={{ background: on ? "#4A7C6F" : "#D1D5DB" }}
      >
        <span
          style={{
            position: "absolute",
            top: 4,
            left: on ? 26 : 4,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "white",
            transition: "left .2s",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
            pointerEvents: "none",
          }}
        />
      </button>
    );
  }

  function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
      <div className="card" style={{ marginBottom: 18 }}>
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
            {title}
          </span>
        </div>
        <div style={{ padding: "16px 18px" }}>{children}</div>
      </div>
    );
  }

  function Field({
    label,
    value,
    type = "text",
    hint,
  }: {
    label: string;
    value: string;
    type?: string;
    hint?: string;
  }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
          {label}
        </label>
        <input defaultValue={value} type={type} className="inp" style={{ width: "100%" }} />
        {hint ? <div style={{ fontSize: 10, color: C.soft, marginTop: 3 }}>{hint}</div> : null}
      </div>
    );
  }

  return (
    <div className="fu" style={{ width: "100%", maxWidth: 780, margin: "0 auto" }}>
      <ToastContainer />

      {b2bBekreft ? (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 20px 60px rgba(0,0,0,.22)",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>{b2bAktiv ? "⚠️" : "🏢"}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>
              {b2bAktiv ? "Deaktiver B2B-funksjoner?" : "Aktiver B2B-funksjoner?"}
            </div>
            <div style={{ fontSize: 12, color: C.soft, textAlign: "center", marginBottom: 14, lineHeight: 1.7 }}>
              {b2bAktiv ? (
                <>
                  Dette vil <strong>skjule B2B-portalen</strong>, deaktivere B2B-innlogging og fjerne B2B-fanene i
                  adminpanelet. Eksisterende kunder og fakturaer påvirkes ikke.
                </>
              ) : (
                <>
                  Dette vil <strong>aktivere B2B-portalen</strong>, B2B-innlogging og alle B2B-funksjoner i
                  adminpanelet.
                </>
              )}
            </div>
            {b2bAktiv ? (
              <div
                style={{
                  background: C.dangerBg,
                  borderRadius: 9,
                  padding: "10px 13px",
                  marginBottom: 16,
                  fontSize: 10,
                  color: C.danger,
                  lineHeight: 1.6,
                }}
              >
                ⚠️ B2B-kunder vil ikke kunne logge inn eller gjøre bestillinger mens funksjonen er deaktivert.
              </div>
            ) : null}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setB2bBekreft(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 10,
                  background: "white",
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={() => {
                  setB2bAktiv((v) => !v);
                  setB2bBekreft(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 10,
                  background: b2bAktiv ? C.danger : C.green,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                {b2bAktiv ? "Deaktiver B2B" : "Aktiver B2B"}
              </button>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      <div
        style={{
          borderRadius: 14,
          border: `2px solid ${b2bAktiv ? C.green : C.danger}`,
          background: b2bAktiv ? C.greenXL : C.dangerBg,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: b2bAktiv ? C.green : C.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          🏢
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 3 }}>
            B2B-funksjoner —{" "}
            {b2bAktiv ? (
              <span style={{ color: C.green }}>Aktiv</span>
            ) : (
              <span style={{ color: C.danger }}>Deaktivert</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.6 }}>
            {b2bAktiv
              ? "B2B-portal, innlogging, fakturering og adminpanel-faner er synlige og operative."
              : "B2B-portalen og innlogging er skjult. Adminpanel viser ikke B2B-faner. Eksisterende data beholdes."}
          </div>
          {b2bAktiv ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {["✓ B2B-portal", "✓ Koordinator-innlogging", "✓ EHF/PEPPOL-faktura", "✓ Rammeavtaler", "✓ Admin B2B-fane"].map(
                (t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      background: "white",
                      color: C.green,
                      padding: "2px 8px",
                      borderRadius: 50,
                      fontWeight: 600,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          ) : null}
          {!b2bAktiv ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {["✗ B2B-portal skjult", "✗ Innlogging blokkert", "✗ EHF-faktura stanset", "✗ Rammeavtaler inaktive"].map(
                (t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      background: "white",
                      color: C.danger,
                      padding: "2px 8px",
                      borderRadius: 50,
                      fontWeight: 600,
                      border: "1px solid rgba(225,29,72,.2)",
                    }}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setB2bBekreft(true)}
          style={{
            padding: "10px 22px",
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "inherit",
            border: "none",
            background: b2bAktiv ? C.danger : C.green,
            color: "white",
            flexShrink: 0,
          }}
        >
          {b2bAktiv ? "Deaktiver B2B" : "Aktiver B2B"}
        </button>
      </div>

      {journalBekreft ? (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 20px 60px rgba(0,0,0,.22)",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>{journalAktiv ? "⚠️" : "📋"}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>
              {journalAktiv ? "Deaktiver journalmodulen?" : "Aktiver journalmodulen?"}
            </div>
            <div style={{ fontSize: 12, color: C.soft, textAlign: "center", marginBottom: 14, lineHeight: 1.7 }}>
              {journalAktiv ? (
                <>
                  Dette vil <strong>skjule journalfunksjonen</strong> for alle sykepleiere. Eksisterende journaldata
                  beholdes.
                </>
              ) : (
                <>Dette aktiverer <strong>journalfunksjonen</strong> for sykepleiere i henhold til valgt modus.</>
              )}
            </div>
            {!journalAktiv ? (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Velg journalmodus:</div>
                {(
                  [
                    [
                      "ekstern",
                      "🔗 Ekstern EPJ",
                      "Sykepleier åpner ekstern EPJ-løsning (CGM Pridok, Aidn) i nettleseren via knapp i appen. Raskest å aktivere — 1–2 dagers arbeid.",
                    ],
                    [
                      "intern",
                      "🏠 Intern journal",
                      "Journal lagres direkte i EiraNova-appen (Supabase). Krever K-JOURNAL-001 ferdig og NHN-sertifisering.",
                    ],
                  ] as const
                ).map(([m, label, sub]) => (
                  <div
                    key={m}
                    role="button"
                    tabIndex={0}
                    onClick={() => setJournalModus(m)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setJournalModus(m);
                      }
                    }}
                    style={{
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: `2px solid ${journalModus === m ? C.green : C.border}`,
                      background: journalModus === m ? C.greenXL : "white",
                      cursor: "pointer",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.5 }}>{sub}</div>
                  </div>
                ))}
                {journalModus === "ekstern" ? (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>EPJ-system og URL:</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      {["CGM Pridok", "Aidn", "Visma Flyt Helse", "Annet"].map((n) => (
                        <div
                          key={n}
                          role="button"
                          tabIndex={0}
                          onClick={() => setJournalEksternNavn(n)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setJournalEksternNavn(n);
                            }
                          }}
                          style={{
                            padding: "7px 10px",
                            borderRadius: 8,
                            border: `1.5px solid ${journalEksternNavn === n ? C.green : C.border}`,
                            background: journalEksternNavn === n ? C.greenXL : "white",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: journalEksternNavn === n ? 600 : 400,
                            color: C.navy,
                            textAlign: "center",
                          }}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                    <input
                      value={journalEksternUrl}
                      onChange={(e) => setJournalEksternUrl(e.target.value)}
                      placeholder="https://minvirksomhet.pridok.no"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 11,
                        fontFamily: "inherit",
                        background: C.greenXL,
                        color: C.navy,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ fontSize: 9, color: C.soft, marginTop: 4 }}>
                      Sykepleier-appen åpner denne URL-en når de trykker «Åpne journal»
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setJournalBekreft(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 10,
                  background: "white",
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={() => {
                  setJournalAktiv((v) => !v);
                  setJournalBekreft(false);
                  toast(
                    journalAktiv ? "Journalmodul deaktivert" : `Journalmodul aktivert — ${journalModus}`,
                  );
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 10,
                  background: journalAktiv ? C.danger : C.green,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                {journalAktiv ? "Deaktiver journal" : "Aktiver journal"}
              </button>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      <div
        style={{
          borderRadius: 14,
          border: `2px solid ${
            journalAktiv ? (journalModus === "intern" ? "#6D28D9" : C.green) : C.border
          }`,
          background: journalAktiv
            ? journalModus === "intern"
              ? "#F5F3FF"
              : C.greenXL
            : "#F9FAFB",
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: journalAktiv ? (journalModus === "intern" ? "#6D28D9" : C.green) : "#D1D5DB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          📋
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 3 }}>
            Journalmodul —{" "}
            {journalAktiv ? (
              <span style={{ color: journalModus === "intern" ? "#6D28D9" : C.green }}>
                {journalModus === "intern" ? "Intern (EiraNova)" : "Ekstern EPJ"}
              </span>
            ) : (
              <span style={{ color: C.soft }}>Deaktivert</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.6 }}>
            {journalAktiv && journalModus === "ekstern" ? (
              <>
                Sykepleiere ser «Åpne journal»-knapp i appen. Trykk → åpner{" "}
                <strong>{journalEksternNavn || "ekstern EPJ"}</strong> i nettleseren. Journal lagres hos ekstern
                leverandør.
              </>
            ) : journalAktiv && journalModus === "intern" ? (
              <>
                Journal lagres direkte i EiraNova (Supabase). Full audit-log, pasientinnsyn og internkontroll aktivert.
                Krever NHN-sertifisering.
              </>
            ) : (
              "Journalmodulen er deaktivert. Sykepleiere ser ingen journal-funksjon i appen. Ingen journalplikt aktiv."
            )}
          </div>
          {journalAktiv ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {(journalModus === "ekstern"
                ? ["✓ Ekstern EPJ aktiv", `✓ ${journalEksternNavn || "EPJ"}`, `✓ ${journalEksternUrl || "URL satt"}`]
                : ["✓ Intern journal", "✓ Supabase lagring", "✓ Audit-log", "✓ Pasientinnsyn"]
              ).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    background: "white",
                    color: journalModus === "intern" ? "#6D28D9" : C.green,
                    padding: "2px 8px",
                    borderRadius: 50,
                    fontWeight: 600,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {!journalAktiv ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {["Ingen journalplikt aktiv", "Stell ikke aktivert", "Start med K-JOURNAL-EXT-001"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    background: "white",
                    color: C.soft,
                    padding: "2px 8px",
                    borderRadius: 50,
                    fontWeight: 600,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, alignItems: "flex-end" }}>
          {journalAktiv ? (
            <select
              value={journalModus}
              onChange={(e) => setJournalModus(e.target.value as JournalModus)}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                borderRadius: 8,
                border: `1.5px solid ${C.border}`,
                background: "white",
                cursor: "pointer",
                fontFamily: "inherit",
                color: C.navy,
              }}
            >
              <option value="ekstern">🔗 Ekstern EPJ</option>
              <option value="intern">🏠 Intern journal</option>
            </select>
          ) : null}
          <button
            type="button"
            onClick={() => setJournalBekreft(true)}
            style={{
              padding: "10px 22px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "inherit",
              border: "none",
              background: journalAktiv ? C.danger : C.green,
              color: "white",
            }}
          >
            {journalAktiv ? "Deaktiver journal" : "Aktiver journal"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#EFF6FF",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 20,
          border: "1px solid rgba(37,99,235,.15)",
          fontSize: 11,
          color: "#1e40af",
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>📊 Regnskapsoppsett — Tripletex for alt</div>
        <div>
          EiraNova bruker <strong>Tripletex</strong> som master for hele regnskapet — både B2C og B2B. Fiken ble vurdert,
          men valgt bort fordi Tripletex håndterer lønn, A-melding og PEPPOL i ett system. <strong>Merk:</strong> Tripletex
          kan sende EHF/PEPPOL direkte til kommuner, men om ønskelig kan Fiken brukes som ren PEPPOL-gateway
          (sending-adapter) mens Tripletex bokfører.
        </div>
      </div>

      <Section title="Organisasjon" icon="🏢">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0 }}>
          <div style={{ paddingRight: 16 }}>
            <Field label="Organisasjonsnavn" value="EiraNova AS" />
            <Field label="Org.nr" value="923 456 789" hint="Brukes på fakturaer og EHF" />
            <Field label="Kontakt-epost" value="post@eiranova.no" />
          </div>
          <div>
            <Field label="Telefon" value="900 12 345" />
            <Field label="Adresse" value="Storgata 1, 1530 Moss" />
            <Field label="Nettside" value="eiranova.no" />
          </div>
        </div>
        <button type="button" className="btn bp" style={{ padding: "8px 20px", fontSize: 12, borderRadius: 9, marginTop: 4 }}>
          Lagre endringer
        </button>
      </Section>

      {mottakerModal ? (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.48)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 18,
              width: "100%",
              maxWidth: 540,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                borderRadius: "18px 18px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>
                  {mottakerModal === "ny" ? "Ny varslingsmottaker" : "Rediger mottaker"}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
                  {mottakerForm.navn || "Ny mottaker"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMottakerModal(null)}
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "none",
                  color: "white",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Navn
                  </label>
                  <input
                    value={mottakerForm.navn}
                    onChange={(e) => setMottakerForm((f) => ({ ...f, navn: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="Fullt navn"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Rolle
                  </label>
                  <input
                    value={mottakerForm.rolle}
                    onChange={(e) => setMottakerForm((f) => ({ ...f, rolle: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="F.eks. Daglig leder"
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  E-postadresse
                </label>
                <input
                  type="email"
                  value={mottakerForm.epost}
                  onChange={(e) => setMottakerForm((f) => ({ ...f, epost: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "9px 11px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                  placeholder="navn@eiranova.no"
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 8 }}>
                  Varslingskanaler
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(
                    [
                      ["epost", "📧 E-post"],
                      ["push", "📱 Push"],
                      ["sms", "💬 SMS"],
                    ] as const
                  ).map(([k, l]) => (
                    <div
                      key={k}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setMottakerForm((f) => ({ ...f, kanal: { ...f.kanal, [k]: !f.kanal[k] } }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMottakerForm((f) => ({ ...f, kanal: { ...f.kanal, [k]: !f.kanal[k] } }));
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: 9,
                        border: `2px solid ${mottakerForm.kanal[k] ? C.green : C.border}`,
                        background: mottakerForm.kanal[k] ? C.greenXL : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: mottakerForm.kanal[k] ? 600 : 400,
                        color: mottakerForm.kanal[k] ? C.navy : C.soft,
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>Varseltyper</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() =>
                        setMottakerForm((f) => ({
                          ...f,
                          varsler: Object.fromEntries(VARSEL_TYPER.map((v) => [v.key, true])),
                        }))
                      }
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        background: C.greenBg,
                        color: C.green,
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      Velg alle
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMottakerForm((f) => ({
                          ...f,
                          varsler: Object.fromEntries(VARSEL_TYPER.map((v) => [v.key, false])),
                        }))
                      }
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        background: C.softBg,
                        color: C.soft,
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Fjern alle
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {VARSEL_TYPER.map((v) => (
                    <div
                      key={v.key}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setMottakerForm((f) => ({
                          ...f,
                          varsler: { ...f.varsler, [v.key]: !f.varsler[v.key] },
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMottakerForm((f) => ({
                            ...f,
                            varsler: { ...f.varsler, [v.key]: !f.varsler[v.key] },
                          }));
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 11px",
                        borderRadius: 8,
                        border: `1.5px solid ${mottakerForm.varsler[v.key] ? C.green : C.border}`,
                        background: mottakerForm.varsler[v.key] ? C.greenXL : "white",
                        cursor: "pointer",
                        transition: "all .12s",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: `2px solid ${mottakerForm.varsler[v.key] ? C.green : C.border}`,
                          background: mottakerForm.varsler[v.key] ? C.green : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "white",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {mottakerForm.varsler[v.key] ? "✓" : ""}
                      </div>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{v.ikon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{v.label}</div>
                        <div style={{ fontSize: 9, color: C.soft }}>{v.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {mottakerModal !== "ny" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMottakere((p) => p.filter((m) => m.id !== mottakerForm.id));
                      setMottakerModal(null);
                    }}
                    style={{
                      padding: "9px 13px",
                      fontSize: 11,
                      borderRadius: 9,
                      background: C.dangerBg,
                      color: C.danger,
                      border: "1px solid rgba(225,29,72,.2)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    🗑
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setMottakerModal(null)}
                  style={{
                    padding: "9px 13px",
                    fontSize: 11,
                    borderRadius: 9,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (mottakerModal === "ny") {
                      setMottakere((p) => [...p, { ...mottakerForm, id: `m${p.length + 1}` }]);
                    } else {
                      setMottakere((p) => p.map((m) => (m.id === mottakerForm.id ? { ...mottakerForm } : m)));
                    }
                    setMottakerModal(null);
                  }}
                  className="btn bp"
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    fontSize: 12,
                    borderRadius: 9,
                    opacity: mottakerForm.navn && mottakerForm.epost ? 1 : 0.5,
                  }}
                >
                  {mottakerModal === "ny" ? "+ Legg til" : "✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      <Section title="Notifikasjoner" icon="🔔">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.soft }}>Hvem mottar varsler og for hvilke hendelser?</div>
          <button
            type="button"
            onClick={() => {
              setMottakerForm({
                id: "",
                navn: "",
                epost: "",
                rolle: "",
                varsler: emptyVarsler(),
                kanal: { epost: true, push: false, sms: false },
                aktiv: true,
              });
              setMottakerModal("ny");
            }}
            style={{
              fontSize: 11,
              padding: "5px 13px",
              background: C.greenBg,
              color: C.green,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            + Legg til mottaker
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {mottakere.map((m) => {
            const aktiveVarsler = VARSEL_TYPER.filter((v) => m.varsler[v.key]);
            return (
              <div
                key={m.id}
                style={{
                  borderRadius: 11,
                  border: `1.5px solid ${C.border}`,
                  overflow: "hidden",
                  background: m.aktiv ? "white" : C.softBg,
                  opacity: m.aktiv ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderBottom: `1px solid ${C.border}`,
                    background: C.greenXL,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {m.navn
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{m.navn}</div>
                    <div style={{ fontSize: 10, color: C.soft }}>
                      {m.rolle} · {m.epost}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    {m.kanal.epost ? (
                      <span
                        style={{
                          fontSize: 9,
                          background: "#EFF6FF",
                          color: C.sky,
                          padding: "1px 6px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        📧
                      </span>
                    ) : null}
                    {m.kanal.push ? (
                      <span
                        style={{
                          fontSize: 9,
                          background: C.greenBg,
                          color: C.green,
                          padding: "1px 6px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        📱
                      </span>
                    ) : null}
                    {m.kanal.sms ? (
                      <span
                        style={{
                          fontSize: 9,
                          background: C.goldBg,
                          color: C.goldDark,
                          padding: "1px 6px",
                          borderRadius: 50,
                          fontWeight: 600,
                        }}
                      >
                        💬
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setMottakerForm({ ...m });
                        setMottakerModal(m);
                      }}
                      style={{
                        fontSize: 10,
                        padding: "3px 10px",
                        background: "white",
                        color: C.navy,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        marginLeft: 4,
                      }}
                    >
                      ✏️
                    </button>
                    <Toggle
                      on={m.aktiv}
                      onToggle={() =>
                        setMottakere((p) => p.map((x) => (x.id === m.id ? { ...x, aktiv: !x.aktiv } : x)))
                      }
                    />
                  </div>
                </div>
                <div style={{ padding: "8px 14px" }}>
                  {aktiveVarsler.length === 0 ? (
                    <div style={{ fontSize: 10, color: C.soft, fontStyle: "italic" }}>
                      Ingen aktive varsler — klikk ✏️ for å konfigurere
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {aktiveVarsler.map((v) => (
                        <span
                          key={v.key}
                          style={{
                            fontSize: 9,
                            background: C.greenBg,
                            color: C.green,
                            padding: "2px 8px",
                            borderRadius: 50,
                            fontWeight: 500,
                            border: `0.5px solid ${C.border}`,
                          }}
                        >
                          {v.ikon} {v.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Alle varseltyper</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 6 }}>
            {VARSEL_TYPER.map((v) => {
              const antall = mottakere.filter((m) => m.aktiv && m.varsler[v.key]).length;
              return (
                <div
                  key={v.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 8,
                    background: antall > 0 ? C.greenXL : C.softBg,
                    border: `1px solid ${antall > 0 ? C.border : "transparent"}`,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{v.ikon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{v.label}</div>
                    <div
                      style={{
                        fontSize: 9,
                        color: C.soft,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v.sub}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: antall > 0 ? C.green : C.soft, flexShrink: 0 }}>
                    {antall} mottaker{antall !== 1 ? "e" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {areaModal ? (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,.22)",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                borderRadius: "16px 16px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                {areaModal === "ny" ? "+ Nytt dekningsområde" : "✏️ Rediger område"}
              </div>
              <button
                type="button"
                onClick={() => setAreaModal(null)}
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "none",
                  color: "white",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Kommunenavn
                  </label>
                  <input
                    value={areaForm.name}
                    onChange={(e) => setAreaForm((f) => ({ ...f, name: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      fontWeight: 600,
                    }}
                    placeholder="F.eks. Halden"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Fylke
                  </label>
                  <input
                    value={areaForm.fylke}
                    onChange={(e) => setAreaForm((f) => ({ ...f, fylke: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="F.eks. Østfold"
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Åpner
                  </label>
                  <input
                    type="time"
                    value={areaForm.apner}
                    onChange={(e) => setAreaForm((f) => ({ ...f, apner: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Stenger
                  </label>
                  <input
                    type="time"
                    value={areaForm.stenges}
                    onChange={(e) => setAreaForm((f) => ({ ...f, stenges: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 11px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: `1px solid ${C.border}`,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Aktivt område</div>
                  <div style={{ fontSize: 10, color: C.soft }}>Vises i bestillingsflyt og vikar-søk</div>
                </div>
                <Toggle on={areaForm.aktiv} onToggle={() => setAreaForm((f) => ({ ...f, aktiv: !f.aktiv }))} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {areaModal !== "ny" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAreas((p) => p.filter((a) => a.id !== areaForm.id));
                      setAreaModal(null);
                    }}
                    style={{
                      padding: "9px 13px",
                      fontSize: 11,
                      borderRadius: 9,
                      background: C.dangerBg,
                      color: C.danger,
                      border: "1px solid rgba(225,29,72,.2)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    🗑 Slett
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setAreaModal(null)}
                  style={{
                    padding: "9px 13px",
                    fontSize: 11,
                    borderRadius: 9,
                    background: "white",
                    color: C.navy,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (areaModal === "ny") {
                      const id = areaForm.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[æ]/g, "ae")
                        .replace(/[øö]/g, "oe")
                        .replace(/[åä]/g, "aa");
                      setAreas((p) => [...p, { ...areaForm, id }]);
                    } else {
                      setAreas((p) => p.map((a) => (a.id === areaForm.id ? { ...areaForm } : a)));
                    }
                    setAreaModal(null);
                  }}
                  className="btn bp"
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    fontSize: 12,
                    borderRadius: 9,
                    opacity: areaForm.name ? 1 : 0.5,
                  }}
                >
                  {areaModal === "ny" ? "+ Legg til" : "✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      <Section title="Dekningsområder & åpningstider" icon="📍">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: C.soft }}>
            {areas.filter((a) => a.aktiv).length} aktive · {areas.filter((a) => !a.aktiv).length} inaktive
          </div>
          <button
            type="button"
            onClick={() => {
              setAreaForm({ id: "", name: "", fylke: "", aktiv: true, apner: "07:00", stenges: "20:00" });
              setAreaModal("ny");
            }}
            style={{
              fontSize: 11,
              padding: "5px 13px",
              background: C.greenBg,
              color: C.green,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            + Legg til kommune
          </button>
        </div>
        {areas
          .filter((a) => a.aktiv)
          .map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
                flexWrap: "wrap",
              }}
            >
              <Toggle
                on={a.aktiv}
                onToggle={() =>
                  setAreas((ar) => ar.map((x) => (x.id === a.id ? { ...x, aktiv: !x.aktiv } : x)))
                }
              />
              <div style={{ flex: "0 0 140px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>📍 {a.name}</div>
                {a.fylke ? <div style={{ fontSize: 9, color: C.soft }}>{a.fylke}</div> : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontSize: 11, color: C.soft }}>Åpner</span>
                <input
                  type="time"
                  value={a.apner}
                  onChange={(e) =>
                    setAreas((ar) => ar.map((x) => (x.id === a.id ? { ...x, apner: e.target.value } : x)))
                  }
                  style={{
                    width: 80,
                    padding: "4px 8px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                />
                <span style={{ fontSize: 11, color: C.soft }}>Stenger</span>
                <input
                  type="time"
                  value={a.stenges}
                  onChange={(e) =>
                    setAreas((ar) => ar.map((x) => (x.id === a.id ? { ...x, stenges: e.target.value } : x)))
                  }
                  style={{
                    width: 80,
                    padding: "4px 8px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setAreaForm({ ...a });
                  setAreaModal(a);
                }}
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  background: C.softBg,
                  color: C.navyMid,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✏️
              </button>
            </div>
          ))}
        {areas.filter((a) => !a.aktiv).length > 0 ? (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: C.soft,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Inaktive
            </div>
            {areas
              .filter((a) => !a.aktiv)
              .map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                    opacity: 0.55,
                  }}
                >
                  <Toggle
                    on={false}
                    onToggle={() =>
                      setAreas((ar) => ar.map((x) => (x.id === a.id ? { ...x, aktiv: true } : x)))
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: C.soft }}>📍 {a.name}</div>
                    {a.fylke ? <div style={{ fontSize: 9, color: C.soft }}>{a.fylke}</div> : null}
                  </div>
                  <span style={{ fontSize: 10, color: C.soft }}>
                    {a.apner}–{a.stenges}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaForm({ ...a });
                      setAreaModal(a);
                    }}
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      background: C.softBg,
                      color: C.navyMid,
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    ✏️
                  </button>
                </div>
              ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => toast("Åpningstider lagret")}
          className="btn bp"
          style={{ padding: "8px 20px", fontSize: 12, borderRadius: 9, marginTop: 14 }}
        >
          Lagre åpningstider
        </button>
      </Section>

      <Section title="Integrasjoner" icon="🔌">
        {[
          {
            navn: "Vipps MobilePay",
            status: "aktiv",
            detalj: "Merchant Serial: 123456 · ePayment API",
            color: "#FF5B24",
            icon: "💜",
          },
          { navn: "Stripe", status: "aktiv", detalj: "Live-modus · Automatiske utbetalinger aktiv", color: C.sky, icon: "💳" },
          {
            navn: "Tripletex (EHF/PEPPOL)",
            status: "aktiv",
            detalj: "Firma: eiranova · PEPPOL-registrert",
            color: "#2563EB",
            icon: "📄",
          },
          {
            navn: "Google Workspace",
            status: "aktiv",
            detalj: "Domain: eiranova.no · 6 aktive kontoer",
            color: "#1A73E8",
            icon: "🔷",
          },
          {
            navn: "Supabase",
            status: "aktiv",
            detalj: "eu-central-1 (Frankfurt) · Prosjekt: prod",
            color: "#3ECF8E",
            icon: "🗄️",
          },
        ].map((integ) => (
          <div
            key={integ.navn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: `${integ.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {integ.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{integ.navn}</div>
              <div style={{ fontSize: 10, color: C.soft }}>{integ.detalj}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
              <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 600 }}>Aktiv</span>
            </div>
            <button
              type="button"
              style={{
                fontSize: 10,
                padding: "4px 11px",
                background: C.softBg,
                color: C.navyMid,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Konfigurer
            </button>
          </div>
        ))}
      </Section>

      <Section title="B2B Fakturering" icon="🧾">
        <div
          style={{
            background: C.skyBg,
            borderRadius: 9,
            padding: "9px 13px",
            fontSize: 10,
            color: "#1e40af",
            lineHeight: 1.6,
            marginBottom: 16,
            border: "1px solid rgba(37,99,235,.15)",
          }}
        >
          <strong>Kun for B2B-kunder.</strong> Privatkunder betaler alltid ved bestilling (Vipps/kort) — ingen faktura
          eller purring for disse.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 0, marginBottom: 14 }}>
          <div style={{ paddingRight: 16 }}>
            <Field label="Standard betalingsfrist (dager)" value="14" hint="Kommuner: 30 dager anbefalt" />
            <Field label="Standard fakturatekst" value="Takk for din bestilling hos EiraNova AS." />
          </div>
          <div>
            <Field label="Faktura-prefiks" value="EIR-2026-" hint="F.eks. EIR-2026-0043" />
            <Field label="MVA-type helsetjenester" value="Unntatt (0%)" hint="Jf. merverdiavgiftsloven §3-2" />
          </div>
        </div>
        <div
          style={{
            background: C.greenXL,
            borderRadius: 9,
            padding: "9px 13px",
            fontSize: 10,
            color: C.navyMid,
            lineHeight: 1.6,
            marginBottom: 14,
          }}
        >
          <strong>EHF/PEPPOL:</strong> Fakturaer til kommuner og EHF-registrerte bedrifter sendes automatisk via
          Tripletex. Konfigurasjon under Integrasjoner → Tripletex.
        </div>
        <button type="button" className="btn bp" style={{ padding: "8px 20px", fontSize: 12, borderRadius: 9 }}>
          Lagre fakturainnstillinger
        </button>
      </Section>

      <Section title="Purring & Inkasso — B2B" icon="⚖️">
        <div
          style={{
            background: "#FFF3E0",
            borderRadius: 9,
            padding: "9px 13px",
            fontSize: 10,
            color: "#92400E",
            lineHeight: 1.6,
            marginBottom: 16,
            border: "1px solid #FDE68A",
          }}
        >
          <strong>Norske regler:</strong> Maks purregebyr <strong>kr 70</strong> per purring (inkassoloven §17).
          Minimum <strong>14 dager</strong> mellom purring og inkassovarsel. Forsinkelsesrente:{" "}
          <strong>9,25% p.a.</strong> fra forfallsdato.
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Automatisk purreflyt</div>
          <div style={{ display: "flex", gap: 0, alignItems: "stretch", flexWrap: "wrap" }}>
            {[
              { dag: "Dag 0", label: "Faktura sendt", icon: "📄", color: C.sky, sub: "EHF/PDF" },
              { dag: "Dag +15", label: "Purring 1", icon: "📩", color: C.gold, sub: "+ kr 70 gebyr" },
              { dag: "Dag +29", label: "Purring 2", icon: "📩", color: "#E65100", sub: "Inkassovarsel" },
              { dag: "Dag +43", label: "Inkasso", icon: "⚖️", color: C.danger, sub: "Manuell godkj." },
            ].map((s, i, arr) => (
              <div key={s.dag} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ textAlign: "center", minWidth: 100 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: s.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      margin: "0 auto 5px",
                      color: "white",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.color }}>{s.dag}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.soft }}>{s.sub}</div>
                </div>
                {i < arr.length - 1 ? (
                  <div style={{ width: 24, height: 2, background: C.border, flexShrink: 0, marginBottom: 20 }} />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <Field label="Dager til purring 1 (etter forfall)" value="15" hint="Min. 1 dag etter forfall" />
            <Field label="Purregebyr 1 (maks kr 70)" value="70" />
          </div>
          <div>
            <Field label="Dager til purring 2" value="14" hint="Min. 14 dager etter purring 1" />
            <Field label="Purregebyr 2 (maks kr 70)" value="70" />
          </div>
        </div>

        {(
          [
            {
              label: "Automatisk purring 1",
              sub: "Sendes automatisk etter angitt antall dager",
              on: autoPurring1,
              setOn: setAutoPurring1,
            },
            {
              label: "Automatisk purring 2 / inkassovarsel",
              sub: "Krever at purring 1 ikke er betalt",
              on: autoPurring2,
              setOn: setAutoPurring2,
            },
            {
              label: "Automatisk oversendelse til inkasso",
              sub: "Deaktivert → krever manuell godkjenning per sak",
              on: autoInkasso,
              setOn: setAutoInkasso,
            },
          ] as const
        ).map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{item.label}</div>
              <div style={{ fontSize: 10, color: C.soft }}>{item.sub}</div>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => item.setOn((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  item.setOn((v) => !v);
                }
              }}
              style={{
                width: 38,
                height: 22,
                borderRadius: 11,
                background: item.on ? "#4A7C6F" : "#D1D5DB",
                cursor: "pointer",
                position: "relative",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: item.on ? 18 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left .2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                }}
              />
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 16,
            background: C.softBg,
            borderRadius: 10,
            padding: "12px 14px",
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Inkassobyrå-innstillinger</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 0 }}>
            <div style={{ paddingRight: 16 }}>
              <Field label="Inkassobyrå" value="Kredinor AS" />
              <Field label="Kundenummer hos byrå" value="EIR-48291" />
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Unntatt fra automatisk inkasso
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {["Kommune", "Stat/offentlig"].map((t) => (
                    <div
                      key={t}
                      style={{
                        fontSize: 10,
                        background: C.greenBg,
                        color: C.green,
                        padding: "3px 10px",
                        borderRadius: 50,
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      ✓ {t}
                    </div>
                  ))}
                  <div
                    style={{
                      fontSize: 10,
                      background: "white",
                      color: C.soft,
                      padding: "3px 10px",
                      borderRadius: 50,
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                    }}
                  >
                    + Legg til
                  </div>
                </div>
                <div style={{ fontSize: 9, color: C.soft, marginTop: 4 }}>
                  Kommuner håndteres alltid manuelt — ring kontaktpersonen først
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn bp" style={{ padding: "8px 20px", fontSize: 12, borderRadius: 9 }}>
            Lagre purreinnstillinger
          </button>
          <button
            type="button"
            style={{
              padding: "8px 16px",
              fontSize: 12,
              borderRadius: 9,
              background: "white",
              color: C.navy,
              border: `1.5px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Se purrelogg →
          </button>
        </div>
      </Section>

      <Section title="Kanselleringsregler — privatkunder" icon="🚫">
        <div
          style={{
            background: C.skyBg,
            borderRadius: 9,
            padding: "9px 13px",
            fontSize: 10,
            color: "#1e40af",
            lineHeight: 1.6,
            marginBottom: 16,
            border: "1px solid rgba(37,99,235,.15)",
          }}
        >
          Gjelder <strong>privatkunder</strong> som betaler med Vipps/kort. B2B-avlysninger håndteres etter rammeavtale
          med organisasjonen.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              Gratis avlysning inntil (timer)
            </label>
            <input
              defaultValue="24"
              style={{
                width: "100%",
                padding: "9px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "inherit",
                background: C.greenXL,
              }}
              type="number"
            />
            <div style={{ fontSize: 9, color: C.soft, marginTop: 3 }}>
              Avlysning mer enn X timer før → full refusjon
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              50% gebyr under (timer)
            </label>
            <input
              defaultValue="12"
              style={{
                width: "100%",
                padding: "9px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "inherit",
                background: C.greenXL,
              }}
              type="number"
            />
            <div style={{ fontSize: 9, color: C.soft, marginTop: 3 }}>Avlysning mellom 12-24t → 50% belastes</div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              100% gebyr under (timer)
            </label>
            <input
              defaultValue="4"
              style={{
                width: "100%",
                padding: "9px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "inherit",
                background: C.greenXL,
              }}
              type="number"
            />
            <div style={{ fontSize: 9, color: C.soft, marginTop: 3 }}>Avlysning under 4t → fullt beløp belastes</div>
          </div>
        </div>
        <div style={{ background: C.softBg, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Slik ser det ut for kunden</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
            {[
              { fra: "Nå", til: "4t før", txt: "Fullt gebyr", bg: C.dangerBg, c: C.danger },
              { fra: "4t", til: "12t før", txt: "50% gebyr", bg: C.goldBg, c: C.goldDark },
              { fra: "12t", til: "24t før", txt: "50% gebyr", bg: C.goldBg, c: C.goldDark },
              { fra: "24t+", til: "", txt: "Gratis", bg: "#F0FDF4", c: "#166534" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: 80,
                  background: s.bg,
                  padding: "8px 10px",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid white" : undefined,
                  borderRadius:
                    i === 0 ? "8px 0 0 8px" : i === 3 ? "0 8px 8px 0" : undefined,
                }}
              >
                <div style={{ fontSize: 9, color: s.c, fontWeight: 700 }}>{s.txt}</div>
                <div style={{ fontSize: 8, color: s.c, opacity: 0.7 }}>
                  {s.fra}
                  {s.til ? ` – ${s.til}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
            EiraNova avlyser (sykepleier syk)
          </label>
          <div
            style={{
              padding: "10px 13px",
              background: "#F0FDF4",
              borderRadius: 8,
              fontSize: 11,
              color: "#166534",
              fontWeight: 500,
            }}
          >
            ✓ Alltid full refusjon — automatisk via Vipps/Stripe API. Kunden varsles umiddelbart.
          </div>
        </div>
        <button type="button" className="btn bp" style={{ padding: "8px 20px", fontSize: 12, borderRadius: 9 }}>
          Lagre kanselleringsregler
        </button>
      </Section>

      <Section title="API-nøkler" icon="🔑">
        <div style={{ fontSize: 11, color: C.soft, marginBottom: 14 }}>
          Nøkler brukes av Cursor/utviklere. Del aldri med uvedkommende.
        </div>
        {[
          { navn: "Vipps Client Secret", key: "sk_vipps_••••••••••••••••3f9a", env: "VIPPS_CLIENT_SECRET" },
          { navn: "Stripe Secret Key", key: "sk_live_••••••••••••••••8k2m", env: "STRIPE_SECRET_KEY" },
          { navn: "Anthropic API Key", key: "sk-ant-••••••••••••••••••••••••4xQ", env: "ANTHROPIC_API_KEY" },
          { navn: "Supabase Service Key", key: "eyJhbGci••••••••••••••••••••••••", env: "SUPABASE_SERVICE_ROLE_KEY" },
        ].map((k) => (
          <div key={k.navn} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{k.navn}</span>
              <span
                style={{
                  fontSize: 9,
                  background: C.softBg,
                  color: C.soft,
                  padding: "2px 8px",
                  borderRadius: 50,
                  fontFamily: "monospace",
                }}
              >
                {k.env}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  background: "#1E1E2E",
                  borderRadius: 7,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#A8B5C8",
                }}
              >
                {showKey[k.env] ? "sk_live_real_key_would_show_here" : k.key}
              </div>
              <button
                type="button"
                onClick={() => setShowKey((s) => ({ ...s, [k.env]: !s[k.env] }))}
                style={{
                  fontSize: 10,
                  padding: "5px 10px",
                  background: C.softBg,
                  color: C.navyMid,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                {showKey[k.env] ? "Skjul" : "Vis"}
              </button>
              <button
                type="button"
                style={{
                  fontSize: 10,
                  padding: "5px 10px",
                  background: C.greenBg,
                  color: C.green,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                Kopier
              </button>
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: 14,
            padding: "10px 13px",
            background: C.dangerBg,
            borderRadius: 9,
            fontSize: 10,
            color: C.danger,
            lineHeight: 1.6,
          }}
        >
          ⚠️ API-nøkler skal aldri deles eller committes til Git. Bruk miljøvariabler i Vercel/Cursor.
        </div>
      </Section>
    </div>
  );
}
