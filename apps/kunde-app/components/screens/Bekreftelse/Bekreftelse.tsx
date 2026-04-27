"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { colors } from "@eiranova/ui";

import { useBestillFlow } from "../Bestill/BestillFlowContext";

const C = colors;

/** Matcher prototype `PH` med kun `title` + `centerTitle` (ingen tilbake-knapp). */
function BekreftelseToppStripe({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <span className="fr" style={{ fontSize: 15, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
        {title}
      </span>
    </div>
  );
}

/**
 * Kunde: ordre bekreftet (prototype `Bekreftelse` ~2497).
 * Leser `useBestillFlow()`; «Til mine bestillinger» nullstiller flyt og går til `/mine`.
 */
export function Bekreftelse() {
  const router = useRouter();
  const { ordre, resetOrdre } = useBestillFlow();
  const [navigerer, setNavigerer] = useState(false);

  const tjeneste = ordre.tjeneste;
  const dato = ordre.dato;
  const tidspunkt = ordre.tidspunkt;
  const manglerOrdre = !tjeneste || !dato || !tidspunkt;

  useEffect(() => {
    if (navigerer) return;
    if (manglerOrdre) {
      void router.replace("/bestill");
    }
  }, [manglerOrdre, navigerer, router]);

  if (manglerOrdre && !navigerer) {
    return (
      <div className="phone fu" style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.navy, marginBottom: 8 }}>Ingen aktiv bestilling</p>
        <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.5, margin: 0 }}>
          Du omdirigeres til bestillingsflyten …
        </p>
      </div>
    );
  }

  if (manglerOrdre && navigerer) {
    return (
      <div className="phone fu" style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.navy, margin: 0 }}>Går til mine bestillinger …</p>
      </div>
    );
  }

  if (!tjeneste || dato == null || tidspunkt == null) {
    return null;
  }

  const tjenesteLabel = tjeneste.name;
  const datoVis = dato;
  const tidVis = tidspunkt;
  const belopTekst = `${tjeneste.price} kr (MVA-unntatt)`;
  const betalingslinje = "Vipps ✓";
  const oppgjorVis = "D+1 virkedag";

  const gaaTilMine = () => {
    setNavigerer(true);
    resetOrdre();
    void router.push("/mine");
  };

  return (
    <div className="phone fu">
      <BekreftelseToppStripe title="Bekreftelse" />
      <div
        className="sa"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 18px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.greenBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 18,
          }}
        >
          ✅
        </div>
        <div className="fr" style={{ fontSize: 22, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
          Bestilling bekreftet!
        </div>
        <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.6, marginBottom: 14 }}>
          Kvittering sendt på e-post. Du får beskjed når sykepleier er tildelt.
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            background: C.greenXL,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 22,
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 4 }}>Avbestilling</div>
          <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.55 }}>
            Du kan avbestille gratis inntil 48 timer før oppdraget. Etter dette må du kontakte oss.
          </div>
        </div>
        <div className="card cp" style={{ width: "100%", marginBottom: 16, textAlign: "left" }}>
          {(
            [
              ["Tjeneste", tjenesteLabel],
              ["Dato", datoVis],
              ["Tid", tidVis],
              ["Beløp", belopTekst],
              ["Betaling", betalingslinje],
              ["Oppgjør", oppgjorVis],
            ] as const
          ).map(([l, v]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 11,
              }}
            >
              <span style={{ color: C.soft }}>{l}</span>
              <span style={{ fontWeight: 600, color: C.navy }}>{v}</span>
            </div>
          ))}
        </div>
        <button type="button" onClick={gaaTilMine} className="btn bp bf" style={{ borderRadius: 11 }}>
          Til mine bestillinger
        </button>
      </div>
    </div>
  );
}
