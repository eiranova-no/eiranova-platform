"use client";

import { useState, useMemo, useCallback } from "react";

import { colors } from "@eiranova/ui";

const C = colors;

type HvemValg = "meg_selv" | "parorende";

const STEGER = [
  { id: "hvem" as const, tittel: "Hvem skal motta hjelp?", sub: "Vi tilpasser opplevelsen for deg" },
  { id: "adresse" as const, tittel: "Hvilken adresse?", sub: "Sykepleieren møter opp her" },
  { id: "klar" as const, tittel: "Alt er klart! 🎉", sub: "Du kan nå bestille din første tjeneste" },
];

export interface KundeOnboardingHandlers {
  onSteg0Neste?: (p: { hvem: HvemValg; navn: string }) => Promise<{ error?: string } | void>;
  onSteg1Neste?: (p: { adresse: string; postnr: string; poststed: string }) => Promise<{ error?: string } | void>;
  onFerdig?: () => void;
}

export interface OnboardingProps {
  kundeOnboarding?: KundeOnboardingHandlers;
  /**
   * Navigasjon ut av flyten når bruker hopper over (prototype: onNav("hjem"))
   * eller siste steg uten egen onFerdig. Bruk f.eks. `() => router.push("/")`.
   */
  onExitToHome: () => void;
}

export function Onboarding({ kundeOnboarding, onExitToHome }: OnboardingProps) {
  const [steg, setSteg] = useState(0);
  const [hvem, setHvem] = useState<HvemValg | null>(null);
  const [adresse, setAdresse] = useState("");
  const [postnr, setPostnr] = useState("");
  const [poststed, setPoststed] = useState("");
  const [navn, setNavn] = useState("");
  const [obFeil, setObFeil] = useState("");

  const S = STEGER[steg];
  const stegerLengde = STEGER.length;

  const progressW = useMemo(
    () => `${Math.round((steg / (stegerLengde - 1)) * 100)}%`,
    [steg, stegerLengde],
  );

  const hoppOver = useCallback(() => {
    onExitToHome();
  }, [onExitToHome]);

  const onNeste = useCallback(async () => {
    setObFeil("");
    if (steg === 0) {
      if (!hvem) return;
      if (hvem === "parorende" && !String(navn || "").trim()) {
        setObFeil("Skriv inn navn på pårørende.");
        return;
      }
      if (kundeOnboarding?.onSteg0Neste) {
        const r = await kundeOnboarding.onSteg0Neste({
          hvem,
          navn: String(navn || "").trim(),
        });
        if (r && typeof r === "object" && "error" in r && r.error) {
          setObFeil(r.error);
          return;
        }
        setSteg((s) => s + 1);
        return;
      }
      if (hvem) setSteg((s) => s + 1);
    } else if (steg === 1) {
      if (!String(adresse || "").trim() || !String(postnr || "").trim() || !String(poststed || "").trim()) {
        setObFeil("Fyll inn adresse, postnummer og poststed.");
        return;
      }
      if (kundeOnboarding?.onSteg1Neste) {
        const r = await kundeOnboarding.onSteg1Neste({
          adresse: String(adresse).trim(),
          postnr: String(postnr).trim(),
          poststed: String(poststed).trim(),
        });
        if (r && typeof r === "object" && "error" in r && r.error) {
          setObFeil(r.error);
          return;
        }
        setSteg((s) => s + 1);
        return;
      }
      if (adresse) setSteg((s) => s + 1);
    }
  }, [steg, hvem, navn, adresse, postnr, poststed, kundeOnboarding]);

  const onBestillFørste = useCallback(() => {
    if (kundeOnboarding?.onFerdig) {
      kundeOnboarding.onFerdig();
    } else {
      onExitToHome();
    }
  }, [kundeOnboarding, onExitToHome]);

  const steg0KanNeste = Boolean(hvem && (hvem !== "parorende" || String(navn || "").trim()));
  const steg1KanNeste = Boolean(
    String(adresse || "").trim() && String(postnr || "").trim() && String(poststed || "").trim(),
  );
  const nesteOpacity = steg === 0 ? (steg0KanNeste ? 1 : 0.4) : steg1KanNeste ? 1 : 0.4;

  return (
    <div className="phone fu" style={{ background: C.cream }}>
      <div style={{ height: 3, background: C.border, flexShrink: 0 }}>
        <div style={{ height: "100%", background: C.green, width: progressW, transition: "width .4s ease" }} />
      </div>
      <div
        style={{
          padding: "16px 20px 0",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 10, color: C.soft }}>
          {steg + 1} av {stegerLengde}
        </span>
        {steg < stegerLengde - 1 && (
          <button
            type="button"
            onClick={hoppOver}
            style={{ fontSize: 10, color: C.soft, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Hopp over
          </button>
        )}
      </div>

      <div className="sa" style={{ padding: "20px 22px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 24 }}>
          <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
            {S.tittel}
          </div>
          <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.6 }}>{S.sub}</div>
        </div>

        {steg === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(
              [
                { key: "meg_selv" as const, icon: "🧓", tittel: "Meg selv", sub: "Jeg ønsker hjelp til meg selv hjemme" },
                {
                  key: "parorende" as const,
                  icon: "👨‍👩‍👧",
                  tittel: "En pårørende",
                  sub: "Jeg bestiller hjelp til et familiemedlem",
                },
              ] as const
            ).map((v) => (
              <div
                key={v.key}
                role="button"
                tabIndex={0}
                onClick={() => setHvem(v.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHvem(v.key);
                  }
                }}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "16px",
                  border: `2px solid ${hvem === v.key ? C.green : C.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "all .15s",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: hvem === v.key ? C.greenBg : C.softBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {v.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{v.tittel}</div>
                  <div style={{ fontSize: 11, color: C.soft }}>{v.sub}</div>
                </div>
                {hvem === v.key && (
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: C.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    aria-hidden
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
            {hvem === "parorende" && (
              <div style={{ marginTop: 4 }}>
                <label htmlFor="onboarding-parorende-navn" style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Navn på pårørende
                </label>
                <input
                  id="onboarding-parorende-navn"
                  value={navn}
                  onChange={(e) => setNavn(e.target.value)}
                  className="inp"
                  placeholder="Ola Nordmann"
                  autoComplete="name"
                />
              </div>
            )}
          </div>
        )}

        {steg === 1 && (
          <div>
            <div style={{ background: "white", borderRadius: 13, padding: "16px", border: `1.5px solid ${C.border}`, marginBottom: 12 }}>
              <label htmlFor="onboarding-adresse" style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>
                Gateadresse
              </label>
              <input
                id="onboarding-adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="inp"
                placeholder="Storgata 12"
                style={{ marginBottom: 8 }}
                autoComplete="street-address"
              />
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 8 }}>
                <input
                  value={postnr}
                  onChange={(e) => setPostnr(e.target.value)}
                  className="inp"
                  placeholder="1500"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
                <input
                  value={poststed}
                  onChange={(e) => setPoststed(e.target.value)}
                  className="inp"
                  placeholder="Moss"
                  autoComplete="address-level2"
                />
              </div>
            </div>
            <div
              style={{
                background: C.greenXL,
                borderRadius: 10,
                padding: "10px 13px",
                fontSize: 10,
                color: C.navyMid,
                lineHeight: 1.6,
              }}
            >
              📍 Vi bruker adressen til å finne sykepleiere i ditt område og gi sykepleieren veibeskrivelse.
            </div>
          </div>
        )}

        {steg === 2 && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 24,
                background: `linear-gradient(135deg,${C.green},${C.greenDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                margin: "0 auto 20px",
                boxShadow: `0 10px 30px ${C.green}44`,
              }}
              aria-hidden
            >
              🌿
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              Velkommen{hvem === "parorende" && navn ? `, og hei til ${navn}!` : "!"}
            </div>
            <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.7 }}>
              Du er klar til å bestille din første tjeneste. Sykepleieren møter deg hjemme, i ro og mak.
            </div>
          </div>
        )}
      </div>

      {obFeil && (
        <div style={{ padding: "0 22px 8px", fontSize: 11, color: C.danger }} role="alert">
          {obFeil}
        </div>
      )}
      <div style={{ padding: "16px 22px 24px", flexShrink: 0 }}>
        {steg < stegerLengde - 1 ? (
          <button
            type="button"
            onClick={() => void onNeste()}
            className="btn bp"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13, opacity: nesteOpacity }}
          >
            {steg === 0 ? "Neste →" : "Lagre adresse →"}
          </button>
        ) : (
          <button type="button" onClick={onBestillFørste} className="btn bp" style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13 }}>
            Bestill din første tjeneste →
          </button>
        )}
      </div>
    </div>
  );
}
