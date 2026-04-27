"use client";

import Link from "next/link";

import { useBestillFlow } from "./BestillFlowContext";

/**
 * Midlertidig side til full Betaling (Fase B2 Steg 3) — verifiserer at `BestillFlowContext` er fylt.
 */
export function BestillBetalingPlassholder() {
  const { ordre } = useBestillFlow();

  return (
    <div className="phone fu" style={{ padding: 24, fontSize: 13, color: "#1A2E24" }}>
      <h1 className="fr" style={{ fontSize: 18, marginBottom: 12 }}>
        Betaling
      </h1>
      <p style={{ marginBottom: 8, lineHeight: 1.5 }}>
        Full betalingsskjerm (Vipps/kort) kommer i eget steg. Ordredata fra wizards er tilgjengelig via <code>useBestillFlow()</code> i layout.
      </p>
      <ul style={{ margin: "0 0 16px 18px", lineHeight: 1.5 }}>
        <li>Tjeneste: {ordre.tjeneste?.name ?? "—"}</li>
        <li>Dato: {ordre.dato ?? "—"}</li>
        <li>Tid: {ordre.tidspunkt ?? "—"}</li>
        <li>Adresse: {ordre.adresse || "—"}</li>
        <li>Sykepleier: {ordre.sykepleierNavn === null ? "EiraNova velger" : (ordre.sykepleierNavn ?? "—")}</li>
      </ul>
      <Link className="btn bp" style={{ display: "inline-block", borderRadius: 10, padding: "10px 16px" }} href="/bestill">
        Tilbake til bestilling
      </Link>
    </div>
  );
}
