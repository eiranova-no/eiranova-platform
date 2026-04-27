"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { STRIPE_P, VIPPS_P } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { useBestillFlow } from "../Bestill/BestillFlowContext";
import { ProfilHeader } from "../KundeProfil/KundeProfil";

const C = colors;

function formatCardInput(v: string): string {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiryInput(v: string): string {
  const d = v.replace(/\D/g, "");
  return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : d;
}

/**
 * Kunde: betaling (prototype `Betaling` ~2426) — leser ordre fra `useBestillFlow()`.
 * Etter vellykket mock-betaling: navigasjon til `/bestill/bekreftelse` (Steg 4).
 */
export function Betaling() {
  const router = useRouter();
  const { ordre } = useBestillFlow();
  const [method, setMethod] = useState<"vipps" | "visa" | "mc">("vipps");
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const tjeneste = ordre.tjeneste;
  const dato = ordre.dato;
  const tidspunkt = ordre.tidspunkt;
  const manglerOrdre = !tjeneste || !dato || !tidspunkt;

  useEffect(() => {
    if (manglerOrdre) {
      void router.replace("/bestill");
    }
  }, [manglerOrdre, router]);

  if (manglerOrdre) {
    return (
      <div className="phone fu" style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.navy, marginBottom: 8 }}>Ingen aktiv bestilling</p>
        <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.5, margin: 0 }}>
          Du omdirigeres til bestillingsflyten …
        </p>
      </div>
    );
  }

  const service = tjeneste;
  const date = dato;
  const time = tidspunkt;
  const inBookFlow = true;

  function pay() {
    setPaying(true);
    window.setTimeout(() => {
      setPaying(false);
      void router.push("/bestill/bekreftelse");
    }, 1800);
  }

  const PM = ({
    id,
    icon,
    label,
    sub,
    bg,
  }: {
    id: "vipps" | "visa" | "mc";
    icon: ReactNode;
    label: string;
    sub: string;
    bg: string;
  }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setMethod(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setMethod(id);
        }
      }}
      style={{
        background: method === id ? "rgba(74,124,111,.06)" : "white",
        borderRadius: 11,
        padding: "12px 13px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 7,
        border: `2px solid ${method === id ? C.green : C.border}`,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 16,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{label}</div>
        <div style={{ fontSize: 9, color: C.soft }}>{sub}</div>
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${method === id ? C.green : C.border}`,
          background: method === id ? C.green : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {method === id ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} /> : null}
      </div>
    </div>
  );

  return (
    <div className="phone fu">
      <ProfilHeader
        title="Betaling"
        onBack={() => {
          void router.push("/bestill");
        }}
        backLabel={inBookFlow ? "Velg sykepleier" : "Tilbake"}
        centerTitle
      />
      <div className="sa" style={{ padding: 13 }}>
        <div className="card cp" style={{ marginBottom: 11 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: C.soft,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Sammendrag
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: C.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
              }}
            >
              {service.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{service.name}</div>
              <div style={{ fontSize: 10, color: C.soft }}>
                {date} · {time}
                {ordre.adresse ? (
                  <span>
                    <br />
                    {ordre.adresse}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          {[
            ["Tjenestepris", `${service.price} kr`],
            ["MVA", "0 kr (helsetjeneste unntatt)"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.soft, marginBottom: 4 }}>
              <span>{l}</span>
              <span>{v}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              fontWeight: 700,
              color: C.navy,
              paddingTop: 6,
              borderTop: `1px solid ${C.border}`,
              marginTop: 3,
            }}
          >
            <span>Totalt</span>
            <span style={{ color: C.green }}>{service.price} kr</span>
          </div>
        </div>
        <div style={{ marginBottom: 11 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: C.soft,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Betalingsmetode
          </div>
          <PM id="vipps" icon="💜" label="Vipps" sub="Raskeste og enkleste" bg={C.vipps} />
          <PM
            id="visa"
            icon={
              <span style={{ fontSize: 10, fontWeight: 900, color: "white", letterSpacing: 1 }}>VISA</span>
            }
            label="Visa"
            sub="Debet- eller kredittkort"
            bg="#1A1F71"
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMethod("mc")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMethod("mc");
              }
            }}
            style={{
              background: method === "mc" ? "rgba(235,0,27,.04)" : "white",
              borderRadius: 11,
              padding: "12px 13px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 7,
              border: `2px solid ${method === "mc" ? "#EB001B" : C.border}`,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "white",
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 4, width: 21, height: 21, borderRadius: "50%", background: "#EB001B" }} />
              <div
                style={{ position: "absolute", right: 4, width: 21, height: 21, borderRadius: "50%", background: "#F79E1B", opacity: 0.9 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Mastercard</div>
              <div style={{ fontSize: 9, color: C.soft }}>Debet- eller kredittkort</div>
            </div>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${method === "mc" ? "#EB001B" : C.border}`,
                background: method === "mc" ? "#EB001B" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {method === "mc" ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} /> : null}
            </div>
          </div>
        </div>
        {(method === "visa" || method === "mc") && (
          <div className="card cp" style={{ marginBottom: 11 }}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Kortnummer</label>
              <input
                className="inp"
                value={card}
                onChange={(e) => setCard(formatCardInput(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                style={{ letterSpacing: 2 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Utløpsdato</label>
                <input
                  className="inp"
                  value={exp}
                  onChange={(e) => setExp(formatExpiryInput(e.target.value))}
                  placeholder="MM/ÅÅ"
                  maxLength={5}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>CVV</label>
                <input
                  className="inp"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="•••"
                  type="password"
                />
              </div>
            </div>
          </div>
        )}
        {method === "vipps" && (
          <div
            style={{
              background: "#FFF5F0",
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 11,
              border: "1px solid rgba(255,91,36,.2)",
              fontSize: 11,
              color: "#994020",
              lineHeight: 1.5,
            }}
          >
            💜 Du videresendes til Vipps-appen for å fullføre betalingen på <strong>{service.price} kr</strong>
            {VIPPS_P[0] ? (
              <span style={{ display: "block", marginTop: 6, fontSize: 9, opacity: 0.9 }}>
                Mock-oppgjør: {VIPPS_P[0].id} ({VIPPS_P[0].status})
              </span>
            ) : null}
          </div>
        )}
        <div
          style={{
            background: C.greenXL,
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 11,
            border: "1px solid rgba(74,124,111,.2)",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: C.greenDark, marginBottom: 4, lineHeight: 1.35 }}>🔒 Trygg forskuddsbetaling</div>
          <div style={{ fontSize: 9, color: C.navyMid, lineHeight: 1.5 }}>
            Du kan avbestille gratis inntil 48 timer før oppdraget og få full refusjon automatisk til betalingsmetoden du brukte.
          </div>
        </div>
        <button
          type="button"
          onClick={pay}
          disabled={paying}
          className="btn bf"
          style={{
            borderRadius: 11,
            background: paying ? "#7FAE96" : method === "vipps" ? C.vipps : C.green,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            border: "none",
            cursor: paying ? "wait" : "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 16px",
          }}
        >
          {paying ? (
            <>
              <div className="spin" />
              <span>Behandler…</span>
            </>
          ) : method === "vipps" ? (
            `💜 Betal ${service.price} kr med Vipps`
          ) : (
            `💳 Betal ${service.price} kr`
          )}
        </button>
        <p style={{ textAlign: "center", fontSize: 9, color: C.soft, marginTop: 9 }}>🔒 Sikker betaling · Kryptert · MVA-unntatt helsetjeneste</p>
        {STRIPE_P[0] ? (
          <p style={{ textAlign: "center", fontSize: 8, color: C.soft, marginTop: 4, lineHeight: 1.4, marginBottom: 0 }}>
            Prototyp (Stripe-mock): {STRIPE_P[0].id} · {STRIPE_P[0].status}
          </p>
        ) : null}
      </div>
    </div>
  );
}
