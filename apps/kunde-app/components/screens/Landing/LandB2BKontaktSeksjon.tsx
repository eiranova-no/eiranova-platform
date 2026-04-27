"use client";

import { useState, type FormEvent } from "react";

import { colors } from "@eiranova/ui";

import { useLandingToast } from "./useLandingToast";

export interface LandB2BKontaktSeksjonProps {
  variant?: "mobile" | "desktop";
}

export function LandB2BKontaktSeksjon({ variant = "mobile" }: LandB2BKontaktSeksjonProps) {
  const { toast, ToastContainer } = useLandingToast();
  const [navn, setNavn] = useState("");
  const [organisasjon, setOrganisasjon] = useState("");
  const [epost, setEpost] = useState("");
  const [telefon, setTelefon] = useState("");
  const [antall, setAntall] = useState("");
  const desktop = variant === "desktop";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast("Takk! Vi tar kontakt med deg innen 1 virkedag.", "ok");
    setNavn("");
    setOrganisasjon("");
    setEpost("");
    setTelefon("");
    setAntall("");
  };

  const fordel = (ikon: string, tekst: string) => (
    <div
      key={tekst}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: desktop ? 12 : 10,
        flex: desktop ? 1 : undefined,
        minWidth: desktop ? 0 : "100%",
      }}
    >
      <div
        style={{
          width: desktop ? 40 : 36,
          height: desktop ? 40 : 36,
          borderRadius: 10,
          background: colors.greenBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: desktop ? 18 : 16,
          flexShrink: 0,
        }}
      >
        {ikon}
      </div>
      <div
        style={{
          fontSize: desktop ? 13 : 12,
          fontWeight: 600,
          color: colors.navy,
          lineHeight: 1.45,
          paddingTop: desktop ? 2 : 0,
        }}
      >
        {tekst}
      </div>
    </div>
  );

  return (
    <section
      id="b2b-kontakt"
      style={{
        background: desktop
          ? "linear-gradient(180deg,#F6FAF8 0%,#EDF5F1 100%)"
          : "linear-gradient(160deg,#F4FAF7,#EEF6F1)",
        padding: desktop ? "56px 40px" : "28px 14px 32px",
        borderTop: desktop ? `1px solid ${colors.border}` : undefined,
      }}
    >
      <ToastContainer />
      <div style={desktop ? { maxWidth: 1200, margin: "0 auto" } : undefined}>
        <div style={{ textAlign: desktop ? "center" : "left", marginBottom: desktop ? 36 : 18 }}>
          <div
            className="fr"
            style={{
              fontSize: desktop ? 30 : 20,
              fontWeight: 600,
              color: colors.navy,
              marginBottom: desktop ? 10 : 6,
              lineHeight: 1.2,
            }}
          >
            Er dere en kommune, borettslag eller bedrift?
          </div>
          <div
            style={{
              fontSize: desktop ? 16 : 13,
              color: colors.soft,
              maxWidth: 560,
              margin: desktop ? "0 auto" : undefined,
              lineHeight: 1.55,
            }}
          >
            Vi tar oss av alt det praktiske — dere fokuserer på menneskene.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: desktop ? "row" : "column",
            gap: desktop ? 20 : 16,
            marginBottom: desktop ? 32 : 20,
            justifyContent: "center",
          }}
        >
          {fordel("🧾", "Samlefaktura (EHF)")}
          {fordel("🤝", "Dedikert koordinator")}
          {fordel("👥", "Fleksibelt antall brukere")}
        </div>
        <form
          onSubmit={onSubmit}
          className="card"
          style={{
            maxWidth: desktop ? 480 : "100%",
            margin: desktop ? "0 auto" : undefined,
            padding: desktop ? 26 : 18,
            borderRadius: 16,
            boxShadow: desktop ? "0 8px 32px rgba(30,58,47,.08)" : undefined,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors.navy,
              marginBottom: 14,
              lineHeight: 1.5,
            }}
          >
            Legg igjen et par detaljer — ingen forpliktelser. Vi tar en kort prat for å forstå behovene deres.
          </div>
          {(
            [
              ["Navn", navn, setNavn, "text", "Ola Nordmann"],
              ["Organisasjon", organisasjon, setOrganisasjon, "text", "F.eks. kommunenavn eller AS"],
              ["E-post", epost, setEpost, "email", "kontakt@organisasjon.no"],
              ["Telefon", telefon, setTelefon, "tel", "900 00 000"],
            ] as const
          ).map(([label, val, setV, type, ph]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: colors.navy,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {label}
              </label>
              <input
                className="inp"
                type={type}
                placeholder={ph}
                value={val}
                onChange={(e) => setV(e.target.value)}
              />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: colors.navy,
                display: "block",
                marginBottom: 4,
              }}
            >
              Antall brukere (ca.)
            </label>
            <input
              className="inp"
              type="text"
              inputMode="numeric"
              placeholder="F.eks. 10"
              value={antall}
              onChange={(e) => setAntall(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn bp bf"
            style={{
              width: "100%",
              padding: desktop ? 14 : 12,
              borderRadius: 12,
              fontSize: desktop ? 14 : 13,
              fontWeight: 600,
            }}
          >
            Ta kontakt — vi ringer deg innen 1 virkedag
          </button>
        </form>
      </div>
    </section>
  );
}
