"use client";

import { colors } from "@eiranova/ui";
import { useState } from "react";

const C = colors;

type PrisModell = "vikar" | "fast" | "hybrid";
type VikarType = "enk" | "midlertidig";

export function PrisKalkulator() {
  const [modell, setModell] = useState<PrisModell>("vikar");

  const [oppdragPerMnd, setOppdragPerMnd] = useState(180);
  const [marginProsent, setMarginProsent] = useState(25);
  const [mvaApplicable, setMvaApplicable] = useState(false);
  const [kmPerOppdrag, setKmPerOppdrag] = useState(8);

  const [vikarSatsHoyt, setVikarSatsHoyt] = useState(320);
  const [vikarSatsLavt, setVikarSatsLavt] = useState(200);
  const [andelHoyt, setAndelHoyt] = useState(55);
  const [vikarType, setVikarType] = useState<VikarType>("enk");

  const [snittVarighet, setSnittVarighet] = useState(60);
  const [timeLonnSpl, setTimeLonnSpl] = useState(275);
  const [timeLonnHj, setTimeLonnHj] = useState(225);
  const [sykeplAndel, setSykeplAndel] = useState(60);

  const [lonnAdmin, setLonnAdmin] = useState(0);
  const [kontorKost, setKontorKost] = useState(2500);
  const [systemKost, setSystemKost] = useState(4200);
  const [forsikring, setForsikring] = useState(3800);
  const [revisor, setRevisor] = useState(4500);
  const [marked, setMarked] = useState(5000);
  const [annetFast, setAnnetFast] = useState(2000);

  const [antallEiere, setAntallEiere] = useState(3);
  const [innskuttKapital, setInnskuttKapital] = useState(100000);
  const [skjermingsrente, setSkjermingsrente] = useState(4.0);

  const totalFastPerMnd =
    (lonnAdmin > 0 ? lonnAdmin * (1 + 0.141 + 0.12 + 0.02) : 0) +
    kontorKost +
    systemKost +
    forsikring +
    revisor +
    marked +
    annetFast;

  const vikarSnittSats = vikarSatsHoyt * (andelHoyt / 100) + vikarSatsLavt * ((100 - andelHoyt) / 100);
  const vikarAgAvgift = vikarType === "midlertidig" ? vikarSnittSats * 0.141 : 0;
  const vikarFeriepeng = vikarType === "midlertidig" ? vikarSnittSats * 0.12 : 0;
  const reisePerOpp = kmPerOppdrag * 4.5;
  const direkteKostVikar = vikarSnittSats + vikarAgAvgift + vikarFeriepeng + reisePerOpp;
  const overheadVikar = oppdragPerMnd > 0 ? totalFastPerMnd / oppdragPerMnd : 0;
  const kostnadVikar = direkteKostVikar + overheadVikar;
  const prisVikar = Math.ceil(kostnadVikar / (1 - marginProsent / 100));
  const prisMedMvaVikar = mvaApplicable ? Math.ceil(prisVikar * 1.25) : prisVikar;
  const bidragPerOpp = prisMedMvaVikar - direkteKostVikar;
  const mndInntektVikar = prisMedMvaVikar * oppdragPerMnd;
  const mndBidrag = bidragPerOpp * oppdragPerMnd;
  const mndResultat = mndBidrag - totalFastPerMnd;

  const timeLonnMix = timeLonnSpl * (sykeplAndel / 100) + timeLonnHj * ((100 - sykeplAndel) / 100);
  const timer = snittVarighet / 60;
  const grunnLonn = timeLonnMix * timer;
  const direkteKostFast = grunnLonn * (1 + 0.141 + 0.12 + 0.02) + reisePerOpp;
  const overheadFast = oppdragPerMnd > 0 ? totalFastPerMnd / oppdragPerMnd : 0;
  const kostnadFast = direkteKostFast + overheadFast;
  const prisFast = Math.ceil(kostnadFast / (1 - marginProsent / 100));

  const skjermingTotal = innskuttKapital * (skjermingsrente / 100);
  const skjermingPerEier = skjermingTotal / antallEiere;
  const utbytteTilgjengelig = Math.max(0, mndResultat * 12);
  const utbyttePerEier = utbytteTilgjengelig / antallEiere;
  const utbytteSkattefritt = Math.min(utbyttePerEier, skjermingPerEier);
  const utbytteSkattepliktig = Math.max(0, utbyttePerEier - skjermingPerEier);
  const utbytteSkatteVikar = utbytteSkattepliktig * 0.3784;
  const utbytteEtterSkatt = utbyttePerEier - utbytteSkatteVikar;

  function Slider({
    label,
    value,
    setValue,
    min,
    max,
    step = 1,
    unit = "",
    hint,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    hint?: string;
  }) {
    return (
      <div style={{ marginBottom: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{label}</label>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
            {Number(value).toLocaleString("nb-NO")}
            {unit}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.green, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.soft, marginTop: 1 }}>
          <span>
            {min}
            {unit}
          </span>
          {hint && (
            <span style={{ fontStyle: "italic", color: C.navyMid }}>{hint}</span>
          )}
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    );
  }

  function EditFelt({
    label,
    value,
    setValue,
    hint,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
    hint?: string;
  }) {
    return (
      <div style={{ marginBottom: 9 }}>
        <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              padding: "7px 9px",
              background: C.border,
              borderRadius: "7px 0 0 7px",
              fontSize: 10,
              color: C.soft,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            kr
          </span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{
              flex: 1,
              padding: "7px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: "0 7px 7px 0",
              fontSize: 11,
              fontFamily: "inherit",
              background: C.greenXL,
              color: C.navy,
              outline: "none",
            }}
          />
        </div>
        {hint && <div style={{ fontSize: 9, color: C.soft, marginTop: 2 }}>{hint}</div>}
      </div>
    );
  }

  const erVikarResultat = modell === "vikar";

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 20 }}>
        {(
          [
            {
              key: "vikar" as const,
              icon: "🤝",
              title: "Vikar per oppdrag",
              sub: "Vikarer fakturerer EiraNova (ENK) eller midlertidig ansatt. Ingen faste lønnskostnader. Eierne tar utbytte.",
              color: C.green,
              border: C.green,
            },
            {
              key: "fast" as const,
              icon: "👔",
              title: "Fast ansatte",
              sub: "Tradisjonell modell. Forutsigbar for ansatte. Høyere faste kostnader.",
              color: C.sky,
              border: C.sky,
            },
            {
              key: "hybrid" as const,
              icon: "⚖️",
              title: "Hybrid",
              sub: "Fast grunnstilling (60%) + oppdragstillegg. Fleksibelt, men mer administrativt.",
              color: C.gold,
              border: C.gold,
            },
          ] as const
        ).map((m) => (
          <div
            key={m.key}
            role="button"
            tabIndex={0}
            onClick={() => setModell(m.key)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setModell(m.key);
              }
            }}
            style={{
              padding: "14px 16px",
              borderRadius: 13,
              border: `2px solid ${modell === m.key ? m.border : C.border}`,
              background: modell === m.key ? `${m.color}0F` : "white",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: modell === m.key ? C.navy : C.navyMid }}>{m.title}</div>
                {modell === m.key && (
                  <span
                    style={{
                      fontSize: 9,
                      background: `${m.color}22`,
                      color: m.color,
                      padding: "1px 7px",
                      borderRadius: 50,
                      fontWeight: 600,
                    }}
                  >
                    Valgt
                  </span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.5 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
          borderRadius: 14,
          padding: "18px 22px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,.5)",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          {modell === "vikar" ? "Vikar per oppdrag" : "Fast ansatt"} · {oppdragPerMnd} oppdrag/mnd · {marginProsent}% margin
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
          {(erVikarResultat
            ? [
                {
                  l: "Listepris per oppdrag",
                  v: `${prisMedMvaVikar.toLocaleString("nb-NO")} kr`,
                  sub: mvaApplicable ? "inkl. MVA" : "eks. MVA",
                  c: "white",
                  big: true,
                },
                {
                  l: "Vikarhonorar (snitt)",
                  v: `-${Math.round(vikarSnittSats)} kr`,
                  sub: vikarType === "enk" ? "ENK-faktura" : "Midl. ansatt",
                  c: "rgba(255,255,255,.7)",
                  big: false,
                },
                {
                  l: "Bidrag per oppdrag",
                  v: `${Math.round(bidragPerOpp)} kr`,
                  sub: `${Math.round((bidragPerOpp / prisMedMvaVikar) * 100)}% bidragsmargin`,
                  c: "#4ABC9E",
                  big: false,
                },
                {
                  l: "Månedlig inntekt",
                  v: `${Math.round(mndInntektVikar / 1000)}k kr`,
                  sub: `${oppdragPerMnd} oppdrag`,
                  c: "rgba(255,255,255,.85)",
                  big: false,
                },
                {
                  l: "Faste kostnader",
                  v: `-${Math.round(totalFastPerMnd / 1000)}k kr`,
                  sub: "Per måned",
                  c: "rgba(255,255,255,.7)",
                  big: false,
                },
                {
                  l: "Til utbytte/buffer",
                  v: `${Math.round(mndResultat / 1000)}k kr`,
                  sub: "Per måned",
                  c: mndResultat > 0 ? "#4ABC9E" : "#F87171",
                  big: true,
                },
              ]
            : [
                {
                  l: "Listepris per oppdrag",
                  v: `${prisFast.toLocaleString("nb-NO")} kr`,
                  sub: `${snittVarighet} min`,
                  c: "white",
                  big: true,
                },
                {
                  l: "Direktekostnad",
                  v: `${Math.round(direkteKostFast)} kr`,
                  sub: "Lønn+AG+ferie+OTP+reise",
                  c: "rgba(255,255,255,.7)",
                  big: false,
                },
                {
                  l: "Overhead per oppdrag",
                  v: `${Math.round(overheadFast)} kr`,
                  sub: "Faste kost ÷ oppdrag",
                  c: "rgba(255,255,255,.7)",
                  big: false,
                },
                {
                  l: "Månedlig inntekt",
                  v: `${Math.round((prisFast * oppdragPerMnd) / 1000)}k kr`,
                  sub: undefined,
                  c: "rgba(255,255,255,.85)",
                  big: false,
                },
                {
                  l: "Månedlige kostnader",
                  v: `-${Math.round((direkteKostFast * oppdragPerMnd + totalFastPerMnd) / 1000)}k kr`,
                  sub: undefined,
                  c: "rgba(255,255,255,.7)",
                  big: false,
                },
                {
                  l: "Månedlig overskudd",
                  v: `${Math.round((prisFast * oppdragPerMnd - direkteKostFast * oppdragPerMnd - totalFastPerMnd) / 1000)}k kr`,
                  sub: undefined,
                  c:
                    prisFast * oppdragPerMnd > direkteKostFast * oppdragPerMnd + totalFastPerMnd ? "#4ABC9E" : "#F87171",
                  big: true,
                },
              ]
          ).map((k) => (
            <div key={k.l}>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,.45)",
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {k.l}
              </div>
              <div className="fr" style={{ fontSize: k.big ? 20 : 15, fontWeight: 700, color: k.c, lineHeight: 1 }}>
                {k.v}
              </div>
              {k.sub && <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{k.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                ⚙️ Generelle parametere
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <Slider label="Oppdrag per måned" value={oppdragPerMnd} setValue={setOppdragPerMnd} min={20} max={400} step={10} hint="Kapasitet" />
              <Slider label="Ønsket margin" value={marginProsent} setValue={setMarginProsent} min={5} max={50} unit="%" hint="Bransjenorm: 20-35%" />
              <Slider label="Km per oppdrag (reise)" value={kmPerOppdrag} setValue={setKmPerOppdrag} min={0} max={30} unit=" km" hint="4,50 kr/km" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>MVA på tjenestene</div>
                  <div style={{ fontSize: 9, color: C.soft }}>Avventer juridisk avklaring</div>
                </div>
                <div
                  role="switch"
                  aria-checked={mvaApplicable}
                  onClick={() => setMvaApplicable((v) => !v)}
                  style={{
                    width: 38,
                    height: 22,
                    borderRadius: 11,
                    background: mvaApplicable ? C.green : "#D1D5DB",
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
                      left: mvaApplicable ? 18 : 3,
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
            </div>
          </div>

          {modell === "vikar" && (
            <div className="card">
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                  🤝 Vikar-satser
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Vikar-type</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(
                      [
                        ["enk", "ENK-faktura", "Vikar = selvstendig næringsdrivende. Ingen AG-avgift for EiraNova."],
                        ["midlertidig", "Midl. ansatt", "Teknisk ansatt per oppdrag. EiraNova betaler AG-avgift og feriepenger."],
                      ] as const
                    ).map(([k, l, sub]) => (
                      <div
                        key={k}
                        role="button"
                        tabIndex={0}
                        onClick={() => setVikarType(k)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setVikarType(k);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "10px 11px",
                          borderRadius: 9,
                          border: `2px solid ${vikarType === k ? C.green : C.border}`,
                          background: vikarType === k ? C.greenXL : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 9, color: C.soft, lineHeight: 1.4 }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {vikarType === "enk" && (
                  <div
                    style={{
                      background: C.greenXL,
                      borderRadius: 9,
                      padding: "8px 11px",
                      fontSize: 10,
                      color: C.navyMid,
                      marginBottom: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    💡 ENK-vikar fakturerer EiraNova. EiraNova betaler <strong>ingen AG-avgift, feriepenger eller pensjon</strong>.
                    Vikaren håndterer egen skatt og MVA. Enklest og billigst for EiraNova.
                  </div>
                )}
                {vikarType === "midlertidig" && (
                  <div
                    style={{
                      background: C.goldBg,
                      borderRadius: 9,
                      padding: "8px 11px",
                      fontSize: 10,
                      color: C.goldDark,
                      marginBottom: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    ⚠️ Midlertidig ansatt utløser <strong>AG-avgift (14,1%) og feriepenger (12%)</strong> fra EiraNova. Høyere
                    kostnad, men mer forutsigbart for vikaren.
                  </div>
                )}
                <Slider label="Honorar — kompleks tjeneste (sykepleier)" value={vikarSatsHoyt} setValue={setVikarSatsHoyt} min={150} max={600} step={10} unit=" kr" hint="Morgensstell, stell m.m." />
                <Slider label="Honorar — enkel tjeneste" value={vikarSatsLavt} setValue={setVikarSatsLavt} min={80} max={400} step={10} unit=" kr" hint="Ringetilsyn, besøk m.m." />
                <Slider label="Andel komplekse tjenester" value={andelHoyt} setValue={setAndelHoyt} min={0} max={100} step={5} unit="%" hint="Resten = enkle tjenester" />
                <div
                  style={{
                    background: C.softBg,
                    borderRadius: 9,
                    padding: "9px 12px",
                    fontSize: 10,
                    color: C.navyMid,
                    lineHeight: 1.6,
                  }}
                >
                  Snitt vikarhonorar: <strong>{Math.round(vikarSnittSats)} kr/oppdrag</strong>
                  {vikarType === "midlertidig" && (
                    <span>
                      {" "}
                      + AG/ferie: <strong>{Math.round(vikarAgAvgift + vikarFeriepeng)} kr</strong>
                    </span>
                  )}{" "}
                  · Total personalkost: <strong>{Math.round(vikarSnittSats + vikarAgAvgift + vikarFeriepeng)} kr</strong>
                </div>
              </div>
            </div>
          )}

          {(modell === "fast" || modell === "hybrid") && (
            <div className="card">
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                  👩‍⚕️ Lønnssatser
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <Slider label="Varighet per oppdrag" value={snittVarighet} setValue={setSnittVarighet} min={15} max={180} step={15} unit=" min" />
                <Slider label="Timelønn sykepleier" value={timeLonnSpl} setValue={setTimeLonnSpl} min={220} max={400} step={5} unit=" kr/t" />
                <Slider label="Timelønn hjelpepleier" value={timeLonnHj} setValue={setTimeLonnHj} min={180} max={320} step={5} unit=" kr/t" />
                <Slider label="Andel sykepleier-oppdrag" value={sykeplAndel} setValue={setSykeplAndel} min={0} max={100} step={5} unit="%" />
                <div
                  style={{
                    background: C.goldBg,
                    borderRadius: 9,
                    padding: "8px 11px",
                    fontSize: 10,
                    color: C.goldDark,
                    lineHeight: 1.6,
                  }}
                >
                  Reell timekostnad inkl. AG/ferie/OTP:{" "}
                  <strong>{Math.round(timeLonnMix * (1 + 0.141 + 0.12 + 0.02))} kr/t</strong>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                🏦 Utbytte-kalkulator
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>
                    Antall eiere
                  </label>
                  <input
                    type="number"
                    value={antallEiere}
                    onChange={(e) => setAntallEiere(Number(e.target.value))}
                    min={1}
                    max={10}
                    style={{
                      width: "100%",
                      padding: "7px 10px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>
                    Innskutt kapital (kr)
                  </label>
                  <input
                    type="number"
                    value={innskuttKapital}
                    onChange={(e) => setInnskuttKapital(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "7px 10px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: C.greenXL,
                    }}
                  />
                </div>
              </div>
              <Slider label="Skjermingsrente 2026" value={skjermingsrente} setValue={setSkjermingsrente} min={0.5} max={8} step={0.1} unit="%" hint="Fastsettes av Skatteetaten" />
              {(
                [
                  { l: "Disponibelt til utbytte (år)", v: `${Math.round(utbytteTilgjengelig / 1000)}k kr`, c: utbytteTilgjengelig > 0 ? C.green : C.danger, bold: false },
                  { l: "Utbytte per eier (år)", v: `${Math.round(utbyttePerEier / 1000)}k kr`, c: C.navy, bold: false },
                  { l: "Skattefritt (skjerming)", v: `${Math.round(utbytteSkattefritt / 1000)}k kr`, c: "#16A34A", bold: false },
                  { l: "Skattepliktig del (37,84%)", v: `${Math.round(utbytteSkattepliktig / 1000)}k kr`, c: C.goldDark, bold: false },
                  { l: "Skatt å betale per eier", v: `${Math.round(utbytteSkatteVikar / 1000)}k kr`, c: C.danger, bold: false },
                  { l: "Netto utbytte per eier", v: `${Math.round(utbytteEtterSkatt / 1000)}k kr`, c: C.green, bold: true },
                ] as const
              ).map((r) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.navyMid }}>{r.l}</span>
                  <span style={{ fontSize: 11, fontWeight: r.bold ? 700 : 600, color: r.c }}>{r.v}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 10,
                  background: C.greenXL,
                  borderRadius: 9,
                  padding: "9px 12px",
                  fontSize: 10,
                  color: C.navyMid,
                  lineHeight: 1.6,
                }}
              >
                💡 Skjermingsfradrag = innskutt kapital × skjermingsrente. Utbytte opp til dette er <strong>skattefritt</strong>.
                Over dette: 37,84% skatt (2026).
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                📊 Kostnadsnedbryting per oppdrag
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {modell === "vikar" ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Personalkostnad
                  </div>
                  {(
                    [
                      {
                        l: "Vikarhonorar (snitt)",
                        v: `${Math.round(vikarSnittSats)} kr`,
                        sub: `${Math.round(vikarSatsHoyt)} kr × ${andelHoyt}% + ${Math.round(vikarSatsLavt)} kr × ${100 - andelHoyt}%`,
                      },
                      ...(vikarType === "midlertidig"
                        ? ([
                            { l: "AG-avgift (14,1%)", v: `${Math.round(vikarAgAvgift)} kr`, sub: undefined },
                            { l: "Feriepenger (12%)", v: `${Math.round(vikarFeriepeng)} kr`, sub: undefined },
                          ] as { l: string; v: string; sub?: string }[])
                        : []),
                      { l: "Reisegodtgjørelse", v: `${Math.round(reisePerOpp)} kr`, sub: `${kmPerOppdrag} km × 4,50 kr` },
                    ] as { l: string; v: string; sub?: string }[]
                  ).map((r) => (
                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.navyMid }}>{r.l}</div>
                        {r.sub && <div style={{ fontSize: 9, color: C.soft }}>{r.sub}</div>}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.navy }}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `2px solid ${C.border}`, marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>Sum personalkost</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>
                      {Math.round(direkteKostVikar - reisePerOpp + reisePerOpp)} kr
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {(
                    [
                      { l: "Grunnlønn", v: `${Math.round(grunnLonn)} kr`, sub: `${timer.toFixed(1)}t × ${Math.round(timeLonnMix)} kr/t` },
                      { l: "AG-avgift (14,1%)", v: `${Math.round(grunnLonn * 0.141)} kr`, sub: undefined },
                      { l: "Feriepenger (12%)", v: `${Math.round(grunnLonn * 0.12)} kr`, sub: undefined },
                      { l: "OTP-pensjon (2%)", v: `${Math.round(grunnLonn * 0.02)} kr`, sub: undefined },
                      { l: "Reisegodtgjørelse", v: `${Math.round(reisePerOpp)} kr`, sub: undefined },
                    ] as const
                  ).map((r) => (
                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.navyMid }}>{r.l}</div>
                        {r.sub && <div style={{ fontSize: 9, color: C.soft }}>{r.sub}</div>}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.navy }}>{r.v}</span>
                    </div>
                  ))}
                </>
              )}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Overhead (fordelt)
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.navyMid }}>Faste kostnader</div>
                    <div style={{ fontSize: 9, color: C.soft }}>
                      {Math.round(totalFastPerMnd / 1000)}k kr/mnd ÷ {oppdragPerMnd} oppdrag
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.navy }}>{Math.round(overheadVikar)} kr</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `2px solid ${C.navy}` }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>TOTALKOSTNAD</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>
                    {Math.round(modell === "vikar" ? kostnadVikar : kostnadFast)} kr
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>+ Margin ({marginProsent}%)</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>
                    + {Math.round((modell === "vikar" ? prisMedMvaVikar : prisFast) - (modell === "vikar" ? kostnadVikar : kostnadFast))} kr
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `2px solid ${C.green}`, marginTop: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>LISTEPRIS</span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: C.green }}>
                    {(modell === "vikar" ? prisMedMvaVikar : prisFast).toLocaleString("nb-NO")} kr
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="fr" style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                🏢 Faste månedskostnader
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{Math.round(totalFastPerMnd / 1000)}k kr/mnd</span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {modell === "vikar" && (
                <div
                  style={{
                    background: "#F0FDF4",
                    borderRadius: 9,
                    padding: "8px 11px",
                    fontSize: 10,
                    color: "#166534",
                    marginBottom: 12,
                    lineHeight: 1.55,
                    border: "1px solid rgba(22,163,74,.2)",
                  }}
                >
                  ✓ <strong>Vikar-modell:</strong> Admin-lønn er 0 kr — eierne tar utbytte istedenfor lønn i oppstartsfasen.
                  Dramatisk lavere faste kostnader.
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" }}>
                <EditFelt label="Admin/lederlønn (brutto)" value={lonnAdmin} setValue={setLonnAdmin} hint={lonnAdmin === 0 ? "Eierne tar utbytte" : "AG-avg og ferie legges til"} />
                <EditFelt label="Kontor & drift" value={kontorKost} setValue={setKontorKost} />
                <EditFelt label="Systemer & lisenser" value={systemKost} setValue={setSystemKost} hint="Tripletex, Supabase, Vercel..." />
                <EditFelt label="Forsikringer" value={forsikring} setValue={setForsikring} />
                <EditFelt label="Revisor" value={revisor} setValue={setRevisor} />
                <EditFelt label="Markedsføring" value={marked} setValue={setMarked} />
                <EditFelt label="Annet fast" value={annetFast} setValue={setAnnetFast} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
            📋 Prismatrise per tjeneste — {modell === "vikar" ? "vikar-modell" : "fast ansatt"}
          </span>
          <span style={{ fontSize: 10, color: C.soft }}>Rød = nåværende pris er for lav · Grønn = pris OK</span>
        </div>
        <div className="tw">
          <table className="tbl">
            <thead>
              <tr>
                <th>Tjeneste</th>
                <th>Varighet</th>
                <th>{modell === "vikar" ? "Vikarhonorar" : "Direktekost"}</th>
                <th>Overhead</th>
                <th>Totalkost</th>
                <th>Anbefalt pris</th>
                <th>B2B (-15%)</th>
                <th>Nå-pris</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  { navn: "Morgensstell & dusj", min: 75, type: "hoyt" as const, pris: 590 },
                  { navn: "Praktisk bistand", min: 60, type: "mix" as const, pris: 490 },
                  { navn: "Besøksvenn", min: 60, type: "lavt" as const, pris: 390 },
                  { navn: "Transport & ærender", min: 90, type: "lavt" as const, pris: 490 },
                  { navn: "Avlastning pårørende", min: 60, type: "lavt" as const, pris: 490 },
                  { navn: "Ringetilsyn", min: 15, type: "lavt" as const, pris: 190 },
                  { navn: "Barsel — Praktisk", min: 60, type: "hoyt" as const, pris: 490 },
                  { navn: "Barsel — Trilleturer", min: 60, type: "lavt" as const, pris: 390 },
                  { navn: "Barsel — Samtale", min: 60, type: "mix" as const, pris: 390 },
                ] as const
              ).map((sv) => {
                let direkte: number;
                if (modell === "vikar") {
                  const sats =
                    sv.type === "hoyt" ? vikarSatsHoyt : sv.type === "lavt" ? vikarSatsLavt : vikarSatsHoyt * 0.6 + vikarSatsLavt * 0.4;
                  const agF = vikarType === "midlertidig" ? sats * (0.141 + 0.12) : 0;
                  direkte = sats + agF + reisePerOpp * (sv.min / snittVarighet || 1);
                } else {
                  const tl = sv.type === "hoyt" ? timeLonnSpl : sv.type === "lavt" ? timeLonnHj : timeLonnSpl * 0.6 + timeLonnHj * 0.4;
                  direkte = tl * (sv.min / 60) * (1 + 0.141 + 0.12 + 0.02) + reisePerOpp;
                }
                const ov = oppdragPerMnd > 0 ? (totalFastPerMnd / oppdragPerMnd) * (sv.min / (snittVarighet || 60)) : 0;
                const kost = direkte + ov;
                const pris = Math.ceil(kost / (1 - marginProsent / 100));
                const b2b = Math.ceil(pris * 0.85);
                const diff = pris - sv.pris;
                return (
                  <tr key={sv.navn} style={{ background: diff > 80 ? "#FFF5F5" : diff < -80 ? "#F0FDF4" : "white" }}>
                    <td style={{ fontWeight: 600, fontSize: 11 }}>{sv.navn}</td>
                    <td style={{ fontSize: 11, color: C.soft }}>{sv.min} min</td>
                    <td style={{ fontSize: 11 }}>{Math.round(direkte - reisePerOpp * (sv.min / (snittVarighet || 60)))} kr</td>
                    <td style={{ fontSize: 11, color: C.soft }}>{Math.round(ov)} kr</td>
                    <td style={{ fontSize: 11, fontWeight: 600 }}>{Math.round(kost)} kr</td>
                    <td style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{pris.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontSize: 11, color: C.sky }}>{b2b.toLocaleString("nb-NO")} kr</td>
                    <td style={{ fontSize: 11, color: C.soft }}>{sv.pris} kr</td>
                    <td style={{ fontSize: 11, fontWeight: 700, color: diff > 50 ? C.danger : diff < -50 ? "#16A34A" : C.soft }}>
                      {diff > 0 ? "+" : ""}
                      {diff} kr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
