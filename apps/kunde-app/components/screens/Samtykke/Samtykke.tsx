"use client";

import { useState, type CSSProperties } from "react";

import { colors } from "@eiranova/ui";

const C = colors;

export interface KundeSamtykkeValg {
  gdpr: boolean;
  vilkaar: boolean;
  markedsf: boolean;
}

export interface SamtykkeProps {
  /** Prototype-fallback når `kundeOnFortsett` mangler, f.eks. `epost-bekreftelse`. */
  onNav: (skjerm: string) => void;
  kundeOnFortsett?: (s: KundeSamtykkeValg) => Promise<{ error?: string } | void>;
}

/** Tynn port av prototype `PH` (kun props som brukes i Samtykke-underbilder). */
function SamtykkeSubHeader({
  title,
  onBack,
  backLabel,
  centerTitle = false,
}: {
  title: string;
  onBack: () => void;
  backLabel: string;
  centerTitle?: boolean;
}) {
  const titleStr = String(title);
  const showTitle = titleStr.trim().length > 0;
  const backLabelTrim = String(backLabel).trim();
  const showBackLabel = backLabelTrim.length > 0;
  const titleStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    lineHeight: 1.25,
    overflowWrap: "anywhere" as const,
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, zIndex: 1 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "rgba(255,255,255,.18)",
            border: "none",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-label="Tilbake"
        >
          ‹
        </button>
        {showBackLabel && (
          <span className="fr" style={{ ...titleStyle, flexShrink: 0 }}>
            {backLabelTrim}
          </span>
        )}
      </div>
      {centerTitle && showTitle ? (
        <span
          className="fr"
          style={{
            ...titleStyle,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            boxSizing: "border-box",
            paddingLeft: showBackLabel ? 200 : 52,
            paddingRight: 52,
          }}
        >
          {titleStr}
        </span>
      ) : showTitle ? (
        <span className="fr" style={{ ...titleStyle, flex: 1, minWidth: 0 }}>
          {titleStr}
        </span>
      ) : (
        <span style={{ flex: 1, minWidth: 0 }} aria-hidden />
      )}
    </div>
  );
}

const GDPR_SECTIONS: { t: string; txt: string }[] = [
  {
    t: "Hvilke data samler vi inn?",
    txt: "Navn, e-post, adresse og betalingsinformasjon ved registrering. Helsedata knyttet til dine bestillinger behandles konfidensielt og deles kun med tildelt sykepleier.",
  },
  {
    t: "Grunnlaget for behandlingen",
    txt: "Behandling av helsedata skjer med ditt eksplisitte samtykke (GDPR art. 9(2)(a)) og for å oppfylle avtalen om helsetjenester (art. 6(1)(b)).",
  },
  {
    t: "Dine rettigheter",
    txt: "Du har rett til innsyn, retting, sletting (art. 17), begrensning og dataportabilitet. Du kan trekke samtykket når som helst. Se Profil → Personvern for å utøve dine rettigheter.",
  },
  {
    t: "Lagringstid",
    txt: "Data slettes 3 år etter siste oppdrag, med unntak av det vi er lovpålagt å beholde (regnskapsdata 5 år). Anonymiserte statistikkdata beholdes uten tidsbegrensning.",
  },
  {
    t: "Kontakt",
    txt: "Vi er personvernansvarlig. Kontakt: lise@eiranova.no · Datatilsynet: datatilsynet.no",
  },
];

const VILKAR_SECTIONS: { t: string; txt: string }[] = [
  {
    t: "Tjenestebeskrivelse",
    txt: "EiraNova AS formidler hjemmehelsetjenester fra kvalifiserte sykepleiere og hjelpepleiere. Vi er ikke et helseforetak, men en formidlingsplattform underlagt helsepersonelloven.",
  },
  {
    t: "Bestilling og betaling",
    txt: "Bestillinger er bindende etter bekreftelse. Avlysning innen 24 timer er gratis. Kortere varsel medfører gebyr etter kanselleringsreglene som vises ved bestilling.",
  },
  {
    t: "Ansvarsbegrensning",
    txt: "EiraNova er ansvarlig for at tjenesteyterne har godkjente kvalifikasjoner. Vi er ikke ansvarlig for skade som oppstår utenfor tjenestens omfang slik det er beskrevet i instruksene.",
  },
  {
    t: "Klage og reklamasjon",
    txt: "Klager behandles innen 5 virkedager. Kunden har rett til refusjon ved dokumenterte avvik fra tjenestebeskrivelsen. Kontakt: post@eiranova.no",
  },
];

export function Samtykke({ onNav, kundeOnFortsett }: SamtykkeProps) {
  const [gdpr, setGdpr] = useState(false);
  const [vilkaar, setVilkaar] = useState(false);
  const [markedsf, setMarkedsf] = useState(false);
  const [lagrerFeil, setLagrerFeil] = useState("");
  const [visGdpr, setVisGdpr] = useState(false);
  const [visVilkaar, setVisVilkaar] = useState(false);
  const kanFortsette = gdpr && vilkaar;

  if (visGdpr) {
    return (
      <div className="phone fu">
        <SamtykkeSubHeader
          title="Personvernerklæring"
          onBack={() => setVisGdpr(false)}
          backLabel="Samtykke"
          centerTitle
        />
        <div className="sa" style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>EiraNova Personvernerklæring</div>
          {GDPR_SECTIONS.map((s) => (
            <div key={s.t} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.7 }}>{s.txt}</div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setGdpr(true);
              setVisGdpr(false);
            }}
            className="btn bp"
            style={{ width: "100%", padding: "12px 0", fontSize: 13, borderRadius: 11, marginTop: 8 }}
          >
            ✓ Jeg har lest og forstått
          </button>
        </div>
      </div>
    );
  }

  if (visVilkaar) {
    return (
      <div className="phone fu">
        <SamtykkeSubHeader
          title="Vilkår for bruk"
          onBack={() => setVisVilkaar(false)}
          backLabel="Samtykke"
          centerTitle
        />
        <div className="sa" style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Vilkår for bruk — EiraNova</div>
          {VILKAR_SECTIONS.map((s) => (
            <div key={s.t} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.7 }}>{s.txt}</div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setVilkaar(true);
              setVisVilkaar(false);
            }}
            className="btn bp"
            style={{ width: "100%", padding: "12px 0", fontSize: 13, borderRadius: 11, marginTop: 8 }}
          >
            ✓ Jeg godtar vilkårene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone fu" style={{ background: C.cream }}>
      <div
        style={{
          padding: "28px 22px 20px",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          textAlign: "center",
        }}
      >
        <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 4 }}>
          Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>Nesten klar — godkjenn for å fortsette</div>
      </div>
      <div className="sa" style={{ padding: "20px 20px" }}>
        <div className="fr" style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          Vi trenger ditt samtykke
        </div>
        <div style={{ fontSize: 11, color: C.soft, marginBottom: 20, lineHeight: 1.6 }}>
          Les gjennom og godkjenn for å opprette konto. De to første er påkrevd.
        </div>

        {(
          [
            {
              key: "gdpr",
              label: "Personvernerklæring",
              sub: "Behandling av dine helsedata (GDPR art. 9)",
              required: true,
              val: gdpr,
              set: setGdpr,
              les: () => setVisGdpr(true),
            },
            {
              key: "vilkaar",
              label: "Vilkår for bruk",
              sub: "Avbestillingsregler, ansvar og reklamasjon",
              required: true,
              val: vilkaar,
              set: setVilkaar,
              les: () => setVisVilkaar(true),
            },
          ] as const
        ).map((s) => (
          <div
            key={s.key}
            style={{
              background: "white",
              borderRadius: 13,
              padding: "13px 15px",
              marginBottom: 10,
              border: `2px solid ${s.val ? C.green : C.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                role="checkbox"
                tabIndex={0}
                aria-checked={s.val}
                onClick={() => s.set((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    s.set((v) => !v);
                  }
                }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${s.val ? C.green : C.border}`,
                  background: s.val ? C.green : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {s.val && (
                  <span style={{ fontSize: 12, color: "white", fontWeight: 700 }} aria-hidden>
                    ✓
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{s.label}</span>
                  <span
                    style={{
                      fontSize: 8,
                      background: C.dangerBg,
                      color: C.danger,
                      padding: "1px 6px",
                      borderRadius: 50,
                      fontWeight: 700,
                    }}
                  >
                    PÅKREVD
                  </span>
                </div>
                <div style={{ fontSize: 10, color: C.soft }}>{s.sub}</div>
              </div>
              <button
                type="button"
                onClick={s.les}
                style={{
                  fontSize: 10,
                  color: C.green,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Les →
              </button>
            </div>
          </div>
        ))}

        <div
          style={{
            background: "white",
            borderRadius: 13,
            padding: "13px 15px",
            marginBottom: 20,
            border: `1.5px solid ${C.border}`,
            opacity: 0.9,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
              role="checkbox"
              tabIndex={0}
              aria-checked={markedsf}
              onClick={() => setMarkedsf((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMarkedsf((v) => !v);
                }
              }}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px solid ${markedsf ? C.green : C.border}`,
                background: markedsf ? C.green : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {markedsf && (
                <span style={{ fontSize: 12, color: "white", fontWeight: 700 }} aria-hidden>
                  ✓
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Markedsføring</span>
                <span
                  style={{
                    fontSize: 8,
                    background: C.softBg,
                    color: C.soft,
                    padding: "1px 6px",
                    borderRadius: 50,
                    fontWeight: 700,
                  }}
                >
                  VALGFRI
                </span>
              </div>
              <div style={{ fontSize: 10, color: C.soft }}>Nyttige tips og tilbud fra EiraNova på e-post</div>
            </div>
          </div>
        </div>

        {lagrerFeil && (
          <div style={{ fontSize: 11, color: C.danger, marginBottom: 8 }} role="alert">
            {lagrerFeil}
          </div>
        )}
        <button
          type="button"
          onClick={async () => {
            if (!kanFortsette) return;
            if (kundeOnFortsett) {
              setLagrerFeil("");
              const r = await kundeOnFortsett({ gdpr, vilkaar, markedsf });
              if (r && "error" in r && r.error) setLagrerFeil(r.error);
              return;
            }
            onNav("epost-bekreftelse");
          }}
          className="btn bp"
          style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13, marginBottom: 10, opacity: kanFortsette ? 1 : 0.4 }}
        >
          Godkjenn og fortsett →
        </button>
        <div style={{ fontSize: 9, color: C.soft, textAlign: "center", lineHeight: 1.6 }}>
          Du kan trekke samtykket når som helst under Profil → Personvern
        </div>
      </div>
    </div>
  );
}
