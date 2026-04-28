"use client";

import { INIT_TJENESTER_CATALOG } from "@eiranova/mock-data";
import type { TjenesteCatalogEntry, TjenesteInstruks } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";

import { InstruktionEditor } from "./InstruktionEditor";
import { TjenesteKalkulator } from "./TjenesteKalkulator";

const C = colors;

interface KategoriItem {
  id: string;
  label: string;
  ikon: string;
  farge: string;
  gradient: string;
}

interface KatFormState {
  id: string;
  label: string;
  ikon: string;
  farge: string;
}

interface TjenesteFormState {
  id: string | null;
  kundeType: string;
  navn: string;
  ikon: string;
  kategori: string;
  beskrivelse: string;
  pris: number | "";
  b2bPris: number | null | "";
  varighet: number;
  mva: string;
  mvaRisiko: string;
  aktiv: boolean;
  utfoertAv: string[];
  tagline: string;
  kundeInkluderer: string[];
  instruks: TjenesteInstruks;
  opprettet?: string;
}

const initKategorierStatic: KategoriItem[] = [
  { id: "eldre", label: "Eldre & Pårørende", ikon: "🏡", farge: C.green, gradient: `linear-gradient(90deg,${C.green},${C.greenLight})` },
  { id: "barsel", label: "Barselstøtte", ikon: "🤱", farge: "#B05C4A", gradient: `linear-gradient(90deg,${C.rose},${C.gold})` },
];

function buildInitInstruks(): TjenesteInstruks {
  return {
    kundeversjon: "",
    sykepleiersjon: "",
    inkluderer: [],
    inkludererIkke: [],
    endretAv: "Lise Andersen",
    endretDato: new Date().toISOString().slice(0, 10),
    versjon: 1,
  };
}

function buildInitForm(kategorier: KategoriItem[]): TjenesteFormState {
  return {
    id: null,
    navn: "",
    ikon: "🏥",
    kategori: kategorier[0]?.id ?? "eldre",
    beskrivelse: "",
    pris: "",
    b2bPris: "",
    varighet: 60,
    mva: "avklares",
    mvaRisiko: "medium",
    aktiv: true,
    utfoertAv: ["hjelpepleier"],
    tagline: "",
    kundeInkluderer: ["", "", "", ""],
    kundeType: "",
    instruks: buildInitInstruks(),
  };
}

export function Tjenester() {
  const [tjenesterCatalog, setTjenesterCatalog] = useState<TjenesteCatalogEntry[]>(() => [...INIT_TJENESTER_CATALOG]);
  const [modal, setModal] = useState<null | "ny" | TjenesteCatalogEntry>(null);
  const [slettModal, setSlettModal] = useState<TjenesteCatalogEntry | null>(null);
  const [filter, setFilter] = useState<string>("alle");

  const [kategorier, setKategorier] = useState<KategoriItem[]>(initKategorierStatic);
  const [katModal, setKatModal] = useState<null | "ny" | KategoriItem>(null);
  const [katForm, setKatForm] = useState<KatFormState>({ id: "", label: "", ikon: "📋", farge: C.sky });

  const [form, setForm] = useState<TjenesteFormState>(() => buildInitForm(initKategorierStatic));

  const filterte = tjenesterCatalog.filter((t) => {
    if (filter === "inaktiv") return !t.aktiv;
    if (filter === "eldre") return t.kategori === "eldre" && t.aktiv;
    if (filter === "barsel") return t.kategori === "barsel" && t.aktiv;
    return t.aktiv;
  });

  const apneModal = (t: TjenesteCatalogEntry | null) => {
    if (t) {
      const ink =
        Array.isArray(t.kundeInkluderer) && t.kundeInkluderer.length
          ? t.kundeInkluderer.map((x) => String(x ?? ""))
          : ["", "", "", ""];
      while (ink.length < 4) ink.push("");
      setForm({
        ...t,
        instruks: t.instruks ?? buildInitInstruks(),
        tagline: t.tagline ?? "",
        kundeInkluderer: ink.slice(0, 6),
        kundeType: t.kundeType ?? "",
        pris: t.pris,
        b2bPris: t.b2bPris ?? "",
      });
    } else {
      setForm({
        ...buildInitForm(kategorier),
        id: `t${tjenesterCatalog.length + 1}`,
        tagline: "",
        kundeInkluderer: ["", "", "", ""],
        kundeType: "",
      });
    }
    setModal(t ?? "ny");
  };

  const lagreTjeneste = () => {
    const trimmedTag = String(form.tagline ?? "").trim().slice(0, 80);
    const inkRå = Array.isArray(form.kundeInkluderer) ? form.kundeInkluderer.map((x) => String(x ?? "").trim()) : [];
    let kt = String(form.kundeType ?? "").trim();
    if (!kt) {
      const fraNavn = String(form.navn ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9æøå]+/gi, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 48);
      kt = fraNavn || String(form.id ?? "tjeneste");
    }
    const prisNum = form.pris === "" ? 0 : Number(form.pris);
    const b2bResolved = form.b2bPris === "" || form.b2bPris === null ? null : Number(form.b2bPris);
    const base: TjenesteCatalogEntry = {
      id: form.id!,
      kundeType: kt,
      navn: form.navn,
      ikon: form.ikon,
      kategori: form.kategori,
      beskrivelse: form.beskrivelse,
      pris: prisNum,
      b2bPris: b2bResolved,
      varighet: form.varighet,
      mva: form.mva,
      mvaRisiko: form.mvaRisiko,
      aktiv: form.aktiv,
      utfoertAv: form.utfoertAv,
      tagline: trimmedTag,
      kundeInkluderer: inkRå,
      instruks: form.instruks,
      opprettet: form.opprettet ?? new Date().toISOString().slice(0, 10),
    };
    if (modal === "ny") {
      setTjenesterCatalog((p) => [...p, { ...base, opprettet: new Date().toISOString().slice(0, 10) }]);
    } else {
      setTjenesterCatalog((p) => p.map((x) => (x.id === form.id ? { ...base, opprettet: x.opprettet } : x)));
    }
    setModal(null);
  };

  const toggleAktiv = (id: string) =>
    setTjenesterCatalog((p) => p.map((t) => (t.id === id ? { ...t, aktiv: !t.aktiv } : t)));

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <div
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        style={{
          width: 38,
          height: 22,
          borderRadius: 11,
          background: on ? C.green : "#D1D5DB",
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
            left: on ? 18 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left .2s",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }}
        />
      </div>
    );
  }

  const mvaFarge = (r: string) => (r === "lav" ? "#16A34A" : r === "medium" ? C.goldDark : C.danger);
  const mvaBg = (r: string) => (r === "lav" ? "#F0FDF4" : r === "medium" ? C.goldBg : C.dangerBg);

  return (
    <div className="fu">
      {modal && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.48)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 18,
              width: "100%",
              maxWidth: 580,
              maxHeight: "92vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                borderRadius: "18px 18px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.5)",
                    marginBottom: 2,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                  }}
                >
                  {modal === "ny" ? "Ny tjeneste" : "Rediger tjeneste"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
                  {form.ikon} {form.navn || "Ny tjeneste"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "none",
                  color: "white",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>Ikon</label>
                  <input
                    value={form.ikon}
                    onChange={(e) => setForm((f) => ({ ...f, ikon: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "10px 8px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 22,
                      textAlign: "center",
                      background: C.greenXL,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Tjenestenavn
                  </label>
                  <input
                    value={form.navn}
                    onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      fontWeight: 600,
                    }}
                    placeholder="F.eks. Kveldsstell"
                  />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Beskrivelse
                </label>
                <input
                  value={form.beskrivelse}
                  onChange={(e) => setForm((f) => ({ ...f, beskrivelse: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                  placeholder="Kort beskrivelse som vises til kunden"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>Tagline (kundeside)</label>
                  <span style={{ fontSize: 9, color: C.soft }}>{String(form.tagline ?? "").length}/80</span>
                </div>
                <input
                  value={form.tagline ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value.slice(0, 80) }))}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "inherit",
                    background: C.greenXL,
                  }}
                  placeholder="Kort setning under tjenestenavnet"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Kundetype (slug)
                </label>
                <input
                  value={form.kundeType ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, kundeType: e.target.value.replace(/\s+/g, "_").slice(0, 48) }))}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "monospace",
                    background: C.softBg,
                  }}
                  placeholder="Tom = genereres fra tjenestenavn ved lagring"
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Hva inngår (kundeside)
                </label>
                {(form.kundeInkluderer ?? []).map((linje, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input
                      value={linje}
                      onChange={(e) =>
                        setForm((f) => {
                          const k = [...(f.kundeInkluderer ?? [])];
                          k[i] = e.target.value;
                          return { ...f, kundeInkluderer: k };
                        })
                      }
                      style={{
                        flex: 1,
                        padding: "8px 11px",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 12,
                        fontFamily: "inherit",
                        background: C.greenXL,
                      }}
                      placeholder={`Punkt ${i + 1}`}
                    />
                    <button
                      type="button"
                      aria-label={`Slett punkt ${i + 1}`}
                      onClick={() =>
                        setForm((f) => ({ ...f, kundeInkluderer: (f.kundeInkluderer ?? []).filter((_, j) => j !== i) }))
                      }
                      style={{
                        flexShrink: 0,
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: `1px solid ${C.border}`,
                        background: "white",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      🗑
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={(form.kundeInkluderer ?? []).length >= 6}
                  onClick={() => setForm((f) => ({ ...f, kundeInkluderer: [...(f.kundeInkluderer ?? []), ""] }))}
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: (form.kundeInkluderer ?? []).length >= 6 ? C.softBg : C.greenBg,
                    color: (form.kundeInkluderer ?? []).length >= 6 ? C.soft : C.green,
                    border: `1px solid ${C.border}`,
                    cursor: (form.kundeInkluderer ?? []).length >= 6 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  + Legg til punkt
                </button>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>Kategori</label>
                  <button
                    type="button"
                    onClick={() => {
                      setKatForm({ id: "", label: "", ikon: "📋", farge: C.sky });
                      setKatModal("ny");
                    }}
                    style={{
                      fontSize: 9,
                      padding: "2px 9px",
                      background: C.greenBg,
                      color: C.green,
                      border: `1px solid ${C.border}`,
                      borderRadius: 5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    + Ny kategori
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {kategorier.map((k) => (
                    <div
                      key={k.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setForm((f) => ({ ...f, kategori: k.id }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setForm((f) => ({ ...f, kategori: k.id }));
                        }
                      }}
                      style={{
                        flex: "1 1 120px",
                        padding: "9px 12px",
                        borderRadius: 9,
                        border: `2px solid ${form.kategori === k.id ? k.farge : C.border}`,
                        background: form.kategori === k.id ? `${k.farge}12` : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: form.kategori === k.id ? 600 : 400,
                        color: form.kategori === k.id ? C.navy : C.soft,
                        transition: "all .15s",
                      }}
                    >
                      {k.ikon} {k.label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Listepris (kr)
                  </label>
                  <input
                    type="number"
                    value={form.pris === "" ? "" : form.pris}
                    onChange={(e) => setForm((f) => ({ ...f, pris: e.target.value === "" ? "" : Number(e.target.value) }))}
                    style={{
                      width: "100%",
                      padding: "9px 10px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      fontWeight: 600,
                      color: C.green,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    B2B-pris (kr)
                  </label>
                  <input
                    type="number"
                    value={form.b2bPris === "" || form.b2bPris === null ? "" : form.b2bPris}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, b2bPris: e.target.value ? Number(e.target.value) : "" }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 10px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                    placeholder="Blank = ingen B2B"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Varighet (min)
                  </label>
                  <input
                    type="number"
                    value={form.varighet}
                    onChange={(e) => setForm((f) => ({ ...f, varighet: Number(e.target.value) }))}
                    style={{
                      width: "100%",
                      padding: "9px 10px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                  Kan utføres av
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(
                    [
                      ["sykepleier", "🩺 Sykepleier"],
                      ["hjelpepleier", "👩‍⚕️ Hjelpepleier"],
                    ] as const
                  ).map(([k, l]) => {
                    const valgt = form.utfoertAv.includes(k);
                    return (
                      <div
                        key={k}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            utfoertAv: valgt ? f.utfoertAv.filter((v) => v !== k) : [...f.utfoertAv, k],
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setForm((f) => ({
                              ...f,
                              utfoertAv: valgt ? f.utfoertAv.filter((v) => v !== k) : [...f.utfoertAv, k],
                            }));
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          borderRadius: 9,
                          border: `2px solid ${valgt ? C.green : C.border}`,
                          background: valgt ? C.greenXL : "white",
                          cursor: "pointer",
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: valgt ? 600 : 400,
                          color: valgt ? C.navy : C.soft,
                        }}
                      >
                        {l}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                  MVA-status
                </label>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {(
                    [
                      ["0%", "0% — Unntatt helsetjeneste", "lav"],
                      ["avklares", "Avklares — grå sone", "medium"],
                      ["25%", "25% — MVA-pliktig", "høy"],
                    ] as const
                  ).map(([v, label, r]) => (
                    <div
                      key={v}
                      role="button"
                      tabIndex={0}
                      onClick={() => setForm((f) => ({ ...f, mva: v, mvaRisiko: r }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setForm((f) => ({ ...f, mva: v, mvaRisiko: r }));
                        }
                      }}
                      style={{
                        flex: 1,
                        minWidth: 120,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: `2px solid ${form.mva === v ? mvaFarge(r) : C.border}`,
                        background: form.mva === v ? mvaBg(r) : "white",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: form.mva === v ? mvaFarge(r) : C.navyMid }}>{v}</div>
                      <div style={{ fontSize: 9, color: C.soft, marginTop: 1 }}>{label.split("—")[1]?.trim()}</div>
                    </div>
                  ))}
                </div>
                {form.mva === "avklares" && (
                  <div
                    style={{
                      marginTop: 8,
                      background: C.goldBg,
                      borderRadius: 8,
                      padding: "7px 11px",
                      fontSize: 10,
                      color: C.goldDark,
                      lineHeight: 1.5,
                    }}
                  >
                    ⚠️ Avklar med revisor før lansering. Risiko for etterbetaling av 25% MVA.
                  </div>
                )}
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
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Tjenesten er aktiv</div>
                  <div style={{ fontSize: 10, color: C.soft }}>Inaktive tjenester vises ikke til kunder</div>
                </div>
                <Toggle on={form.aktiv} onToggle={() => setForm((f) => ({ ...f, aktiv: !f.aktiv }))} />
              </div>
              <InstruktionEditor
                instruks={form.instruks}
                onChange={(instruks) => setForm((f) => ({ ...f, instruks }))}
                tjenestNavn={form.navn}
              />
              <TjenesteKalkulator varighet={form.varighet} navnTjeneste={form.navn} />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  style={{
                    padding: "10px 18px",
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
                  onClick={lagreTjeneste}
                  className="btn bp"
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    fontSize: 13,
                    borderRadius: 10,
                    opacity: form.navn && form.pris !== "" && form.pris !== 0 ? 1 : 0.5,
                  }}
                >
                  {modal === "ny" ? "✓ Opprett tjeneste" : "✓ Lagre endringer"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {slettModal && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.48)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 400,
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>
              Deaktiver tjeneste?
            </div>
            <div style={{ fontSize: 12, color: C.soft, textAlign: "center", marginBottom: 6, lineHeight: 1.6 }}>
              <strong>
                {slettModal.ikon} {slettModal.navn}
              </strong>{" "}
              vil skjules for kunder og kan ikke bestilles.
            </div>
            <div
              style={{
                background: C.greenXL,
                borderRadius: 9,
                padding: "9px 13px",
                fontSize: 10,
                color: C.navyMid,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              💡 Tjenesten <strong>slettes ikke</strong> — den deaktiveres. Historikk og bestillinger beholdes. Du kan reaktivere når som
              helst.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setSlettModal(null)}
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
                  toggleAktiv(slettModal.id);
                  setSlettModal(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 10,
                  background: C.dangerBg,
                  color: C.danger,
                  border: "1px solid rgba(225,29,72,.2)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                Deaktiver
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {katModal && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
                borderRadius: "16px 16px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                {katModal === "ny" ? "+ Ny kategori" : "✏️ Rediger kategori"}
              </div>
              <button
                type="button"
                onClick={() => setKatModal(null)}
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
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>Ikon</label>
                  <input
                    value={katForm.ikon}
                    onChange={(e) => setKatForm((f) => ({ ...f, ikon: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 6px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 22,
                      textAlign: "center",
                      background: C.greenXL,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    Kategorinavn
                  </label>
                  <input
                    value={katForm.label}
                    onChange={(e) => setKatForm((f) => ({ ...f, label: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: C.greenXL,
                      fontWeight: 600,
                    }}
                    placeholder="F.eks. Rehabilitering"
                  />
                </div>
              </div>
              {katModal !== "ny" && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                    ID (endres ikke)
                  </label>
                  <input
                    value={katForm.id}
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 11,
                      fontFamily: "monospace",
                      background: C.softBg,
                      color: C.soft,
                    }}
                  />
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                  Farge
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[C.green, C.sky, "#B05C4A", C.gold, "#6D28D9", "#0891B2", "#BE185D", C.navyMid].map((c) => (
                    <div
                      key={c}
                      role="button"
                      tabIndex={0}
                      onClick={() => setKatForm((f) => ({ ...f, farge: c }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setKatForm((f) => ({ ...f, farge: c }));
                        }
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c,
                        cursor: "pointer",
                        border: `3px solid ${katForm.farge === c ? "white" : "transparent"}`,
                        boxShadow: katForm.farge === c ? `0 0 0 2px ${c}` : "none",
                        transition: "all .15s",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 13px",
                  borderRadius: 9,
                  border: `2px solid ${katForm.farge}`,
                  background: `${katForm.farge}10`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{katForm.ikon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{katForm.label || "Kategorinavn"}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: katForm.farge, fontWeight: 600 }}>Forhåndsvisning</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {katModal !== "ny" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (tjenesterCatalog.some((t) => t.kategori === katForm.id)) {
                        alert("Kan ikke slette — kategorien har aktive tjenester.");
                        return;
                      }
                      setKategorier((p) => p.filter((k) => k.id !== katForm.id));
                      setKatModal(null);
                    }}
                    style={{
                      padding: "9px 14px",
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
                )}
                <button
                  type="button"
                  onClick={() => setKatModal(null)}
                  style={{
                    padding: "9px 14px",
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
                    if (katModal === "ny") {
                      const id = katForm.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                      setKategorier((p) => [
                        ...p,
                        {
                          ...katForm,
                          id,
                          gradient: `linear-gradient(90deg,${katForm.farge},${katForm.farge}99)`,
                        },
                      ]);
                    } else {
                      setKategorier((p) =>
                        p.map((k) =>
                          k.id === katForm.id
                            ? { ...katForm, gradient: `linear-gradient(90deg,${katForm.farge},${katForm.farge}99)` }
                            : k,
                        ),
                      );
                    }
                    setKatModal(null);
                  }}
                  className="btn bp"
                  style={{ flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 9, opacity: katForm.label ? 1 : 0.5 }}
                >
                  {katModal === "ny" ? "+ Opprett" : "✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Kategorier ({kategorier.length})</span>
          <button
            type="button"
            onClick={() => {
              setKatForm({ id: "", label: "", ikon: "📋", farge: C.sky });
              setKatModal("ny");
            }}
            style={{
              fontSize: 10,
              padding: "4px 12px",
              background: C.greenBg,
              color: C.green,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            + Ny kategori
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {kategorier.map((k) => (
            <div
              key={k.id}
              role="button"
              tabIndex={0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 13px",
                borderRadius: 9,
                border: `1.5px solid ${k.farge}44`,
                background: `${k.farge}08`,
                cursor: "pointer",
                transition: "all .15s",
              }}
              onClick={() => {
                setKatForm({ id: k.id, label: k.label, ikon: k.ikon, farge: k.farge });
                setKatModal(k);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setKatForm({ id: k.id, label: k.label, ikon: k.ikon, farge: k.farge });
                  setKatModal(k);
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{k.ikon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{k.label}</div>
                <div style={{ fontSize: 9, color: C.soft }}>
                  {tjenesterCatalog.filter((t) => t.kategori === k.id && t.aktiv).length} tjenester
                </div>
              </div>
              <span style={{ fontSize: 10, color: k.farge, marginLeft: 4 }}>✏️</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
            Tjenester & priser
          </div>
          <div style={{ fontSize: 11, color: C.soft }}>
            {tjenesterCatalog.filter((t) => t.aktiv).length} aktive · {tjenesterCatalog.filter((t) => !t.aktiv).length} inaktive
          </div>
        </div>
        <button type="button" onClick={() => apneModal(null)} className="btn bp" style={{ fontSize: 12, padding: "9px 18px", borderRadius: 10 }}>
          + Legg til tjeneste
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: "white",
          borderRadius: 9,
          padding: 3,
          marginBottom: 16,
          border: `1px solid ${C.border}`,
          width: "fit-content",
          gap: 0,
        }}
      >
        {[["alle", "Alle"], ...kategorier.map((k) => [k.id, `${k.ikon} ${k.label}`] as const), ["inaktiv", "⏸ Inaktive"] as const].map(
          ([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: filter === k ? 600 : 400,
                cursor: "pointer",
                border: "none",
                background: filter === k ? C.greenBg : "transparent",
                color: filter === k ? C.green : C.soft,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {l}
            </button>
          ),
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {filterte.map((t) => (
          <div key={t.id} className="card" style={{ opacity: t.aktiv ? 1 : 0.55, overflow: "hidden" }}>
            <div
              style={{
                height: 4,
                background:
                  kategorier.find((k) => k.id === t.kategori)?.gradient ?? `linear-gradient(90deg,${C.green},${C.greenLight})`,
              }}
            />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: `${kategorier.find((k) => k.id === t.kategori)?.farge ?? C.green}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {t.ikon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{t.navn}</div>
                  <div style={{ fontSize: 10, color: C.soft, marginBottom: 4 }}>{t.beskrivelse}</div>
                  {t.tagline ? (
                    <div style={{ fontSize: 9, color: C.navyMid, marginBottom: 4, lineHeight: 1.35, fontStyle: "italic" }}>{t.tagline}</div>
                  ) : null}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {t.utfoertAv.map((u) => (
                      <span
                        key={u}
                        style={{
                          fontSize: 9,
                          background: C.softBg,
                          color: C.navyMid,
                          padding: "1px 7px",
                          borderRadius: 50,
                          fontWeight: 500,
                        }}
                      >
                        {u === "sykepleier" ? "🩺 Sykepleier" : "👩‍⚕️ Hjelpepleier"}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 9,
                        background: C.greenXL,
                        color: C.green,
                        padding: "1px 7px",
                        borderRadius: 50,
                        fontWeight: 500,
                      }}
                    >
                      ⏱ {t.varighet} min
                    </span>
                  </div>
                </div>
                <Toggle
                  on={t.aktiv}
                  onToggle={() => (t.aktiv ? setSlettModal(t) : toggleAktiv(t.id))}
                />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    flex: 1,
                    background: C.greenXL,
                    borderRadius: 8,
                    padding: "8px 10px",
                    textAlign: "center",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 9, color: C.soft, marginBottom: 1 }}>Listepris</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.green }}>{t.pris.toLocaleString("nb-NO")} kr</div>
                </div>
                {t.b2bPris ? (
                  <div
                    style={{
                      flex: 1,
                      background: "#EEF2FF",
                      borderRadius: 8,
                      padding: "8px 10px",
                      textAlign: "center",
                      border: "1px solid #C7D2FE",
                    }}
                  >
                    <div style={{ fontSize: 9, color: C.soft, marginBottom: 1 }}>B2B-pris</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#3B82F6" }}>{t.b2bPris.toLocaleString("nb-NO")} kr</div>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      background: C.softBg,
                      borderRadius: 8,
                      padding: "8px 10px",
                      textAlign: "center",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{ fontSize: 9, color: C.soft, marginBottom: 1 }}>B2B-pris</div>
                    <div style={{ fontSize: 11, color: C.soft, fontStyle: "italic" }}>Listepris</div>
                  </div>
                )}
                <div
                  style={{
                    flex: 1,
                    background: mvaBg(t.mvaRisiko),
                    borderRadius: 8,
                    padding: "8px 10px",
                    textAlign: "center",
                    border: `1px solid ${mvaFarge(t.mvaRisiko)}22`,
                  }}
                >
                  <div style={{ fontSize: 9, color: C.soft, marginBottom: 1 }}>MVA</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mvaFarge(t.mvaRisiko) }}>{t.mva}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 9 }}>
                {t.instruks?.kundeversjon ? (
                  <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                    ✓ Instruks opprettet
                  </span>
                ) : (
                  <span style={{ background: C.goldBg, color: C.goldDark, padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                    ⚠ Mangler instruks
                  </span>
                )}
                {t.instruks?.versjon ? (
                  <span style={{ color: C.soft }}>
                    v{t.instruks.versjon} · {t.instruks.endretDato}
                  </span>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => apneModal(t)}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    fontSize: 11,
                    borderRadius: 8,
                    background: C.greenBg,
                    color: C.green,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  ✏️ Rediger
                </button>
                <button
                  type="button"
                  onClick={() => setSlettModal(t)}
                  style={{
                    padding: "7px 14px",
                    fontSize: 11,
                    borderRadius: 8,
                    background: t.aktiv ? C.dangerBg : C.greenBg,
                    color: t.aktiv ? C.danger : C.green,
                    border: `1px solid ${t.aktiv ? "rgba(225,29,72,.2)" : C.border}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {t.aktiv ? "⏸ Deaktiver" : "▶️ Aktiver"}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div
          role="button"
          tabIndex={0}
          onClick={() => apneModal(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              apneModal(null);
            }
          }}
          style={{
            border: `2px dashed ${C.border}`,
            borderRadius: 14,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            minHeight: 180,
            transition: "border-color .15s",
            background: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.green;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: C.greenBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            +
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Legg til tjeneste</div>
          <div style={{ fontSize: 10, color: C.soft, textAlign: "center" }}>Klikk for å opprette en ny tjeneste</div>
        </div>
      </div>

      {tjenesterCatalog.filter((t) => t.aktiv && t.mvaRisiko === "høy").length > 0 && (
        <div
          style={{
            background: C.dangerBg,
            borderRadius: 12,
            padding: "13px 16px",
            border: "1px solid rgba(225,29,72,.2)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚖️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.danger, marginBottom: 4 }}>
              MVA-advarsel — {tjenesterCatalog.filter((t) => t.aktiv && t.mvaRisiko === "høy").length} tjenester med høy risiko
            </div>
            <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.6 }}>
              {tjenesterCatalog
                .filter((t) => t.aktiv && t.mvaRisiko === "høy")
                .map((t) => t.navn)
                .join(", ")}{" "}
              — Skatteetaten har i tidligere saker krevd etterbetaling av 25% MVA for disse tjenestetypene.{" "}
              <strong>Avklar med revisor før lansering.</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
