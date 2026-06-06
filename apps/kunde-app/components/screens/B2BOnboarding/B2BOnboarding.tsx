"use client";

import { B2B_C } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const C = colors;

function erGyldigEpost(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

export function B2BOnboarding() {
  const router = useRouter();
  const org = B2B_C[0];
  const avtaleLabel = org.prismodell === "rammeavtale" ? "Rammeavtale" : "Per bestilling";

  const [steg, setSteg] = useState(0);
  const [fulltNavn, setFulltNavn] = useState("Bjørn Haugen");
  const [telefon, setTelefon] = useState("");
  const [fakturaAdr, setFakturaAdr] = useState("Postmottak helse og omsorg\n1501 Moss");
  const [ehfPå, setEhfPå] = useState(org.type === "kommune");
  const [forsteBrukerNavn, setForsteBrukerNavn] = useState("");
  const [forsteBrukerEpost, setForsteBrukerEpost] = useState("");

  const totalSteg = 3;
  const kanSendeForsteBruker =
    forsteBrukerNavn.trim().length > 0 && erGyldigEpost(forsteBrukerEpost);
  const progressW = `${Math.round((steg / Math.max(totalSteg - 1, 1)) * 100)}%`;

  const fullførDash = () => router.push("/b2b/dashboard");
  const fullførBestill = () => router.push("/b2b/bestill");

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
          maxWidth: 540,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <span style={{ fontSize: 10, color: C.soft }}>
          {steg + 1} av {totalSteg}
        </span>
        {steg < totalSteg - 1 ? (
          <button
            type="button"
            onClick={fullførDash}
            style={{
              fontSize: 10,
              color: C.soft,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Hopp over
          </button>
        ) : null}
      </div>
      <div className="sa" style={{ padding: "20px 22px", maxWidth: 540, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {steg === 0 ? (
          <>
            <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              Velkommen, {fulltNavn.split(" ")[0]}! 🏢
            </div>
            <div
              style={{
                background: "white",
                borderRadius: 13,
                padding: "14px 16px",
                border: `1.5px solid ${C.border}`,
                marginBottom: 14,
                fontSize: 12,
                color: C.navy,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{ color: C.soft }}>Organisasjon</span>
                <span style={{ fontWeight: 600 }}>{org.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{ color: C.soft }}>Org.nr.</span>
                <span style={{ fontWeight: 600 }}>{org.org}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: C.soft }}>Avtale</span>
                <span style={{ fontWeight: 600 }}>{avtaleLabel}</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.65, marginBottom: 8 }}>
              Din rammeavtale med EiraNova er aktiv. La oss sette opp koordinatorkontoen.
            </div>
          </>
        ) : null}
        {steg === 1 ? (
          <>
            <div className="fr" style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Kontaktinformasjon
            </div>
            <div style={{ fontSize: 11, color: C.soft, marginBottom: 14, lineHeight: 1.6 }}>
              Disse opplysningene brukes av EiraNova ved behov for avklaring og på faktura.
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                Fullt navn
              </label>
              <input
                className="inp"
                value={fulltNavn}
                onChange={(e) => setFulltNavn(e.target.value)}
                placeholder="Fornavn Etternavn"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                Direkte telefon
              </label>
              <input
                className="inp"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="415 00 000"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                Fakturaadresse
              </label>
              <textarea
                className="inp"
                value={fakturaAdr}
                onChange={(e) => setFakturaAdr(e.target.value)}
                rows={3}
                style={{ resize: "vertical", minHeight: 72 }}
              />
            </div>
            <div
              style={{
                background: "white",
                borderRadius: 13,
                padding: "12px 14px",
                border: `1.5px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>EHF-aktivert</div>
                <div style={{ fontSize: 9, color: C.soft, marginTop: 2, lineHeight: 1.45 }}>
                  Fakturaer sendes via PEPPOL til kommunens fakturasystem
                </div>
              </div>
              <button
                type="button"
                className="settings-toggle"
                onClick={() => setEhfPå((v) => !v)}
                aria-pressed={ehfPå}
                style={{ position: "relative", background: ehfPå ? C.green : "#D1D5DB", flexShrink: 0 }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    left: ehfPå ? 26 : 4,
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
            </div>
          </>
        ) : null}
        {steg === 2 ? (
          <>
            <div className="fr" style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              Dine brukere
            </div>
            <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.65, marginBottom: 16 }}>
              Du kan nå legge til brukere som skal motta tjenester fra EiraNova.
            </div>
            <div style={{ background: "white", borderRadius: 13, padding: "14px 16px", border: `1.5px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Første bruker</div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  Fullt navn
                </label>
                <input
                  className="inp"
                  value={forsteBrukerNavn}
                  onChange={(e) => setForsteBrukerNavn(e.target.value)}
                  placeholder="Ola Nordmann"
                  autoComplete="name"
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                  E-post
                </label>
                <input
                  className="inp"
                  type="email"
                  value={forsteBrukerEpost}
                  onChange={(e) => setForsteBrukerEpost(e.target.value)}
                  placeholder="ola@eksempel.no"
                  autoComplete="email"
                />
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: C.soft, lineHeight: 1.55 }}>
              Brukeren får invitasjon på e-post for å aktivere kontoen og kan deretter motta bestillinger.
            </div>
          </>
        ) : null}
      </div>
      <div
        style={{
          padding: "16px 22px 24px",
          flexShrink: 0,
          maxWidth: 540,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {steg === 0 ? (
          <button
            type="button"
            onClick={() => setSteg(1)}
            className="btn bp"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13 }}
          >
            Kom i gang →
          </button>
        ) : null}
        {steg === 1 ? (
          <button
            type="button"
            onClick={() => telefon.trim() && setSteg(2)}
            className="btn bp"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13, opacity: telefon.trim() ? 1 : 0.4 }}
          >
            Neste →
          </button>
        ) : null}
        {steg === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={() => kanSendeForsteBruker && fullførBestill()}
              className="btn bp"
              style={{
                width: "100%",
                padding: "14px 0",
                fontSize: 14,
                borderRadius: 13,
                opacity: kanSendeForsteBruker ? 1 : 0.4,
              }}
            >
              Legg til første bruker nå →
            </button>
            <button
              type="button"
              onClick={fullførDash}
              className="btn"
              style={{
                width: "100%",
                padding: "14px 0",
                fontSize: 14,
                borderRadius: 13,
                background: "white",
                color: C.navy,
                border: `1.5px solid ${C.border}`,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Gjør dette senere →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
