"use client";

import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const C = colors;

const TITLER = ["Sykepleier", "Hjelpepleier", "Vernepleier", "Helsefagarbeider"] as const;
const SPEC_OPTS = ["Eldre", "Barsel", "Demens", "Psykiatri", "Palliasjon", "Barn"];
const KOMM_NAVN = ["Moss", "Fredrikstad", "Sarpsborg", "Råde", "Vestby", "Ås", "Ski"];
const REISE_OPTS = ["15 min", "30 min", "45 min", "60 min+"];

export function Onboarding() {
  const router = useRouter();

  const [steg, setSteg] = useState(0);
  const fornavn = "Sara";
  const antallSteg = 4;
  const progressW = `${Math.round((steg / Math.max(antallSteg - 1, 1)) * 100)}%`;

  const [hpr, setHpr] = useState("");
  const [tittel, setTittel] = useState("Sykepleier");
  const [spec, setSpec] = useState<string[]>([]);
  const toggleSpec = (x: string) => {
    setSpec((p) => (p.includes(x) ? p.filter((s) => s !== x) : [...p, x]));
  };

  const [kommSel, setKommSel] = useState(() => new Set<string>(["Moss"]));
  const toggleKomm = (k: string) => {
    setKommSel((p) => {
      const n = new Set(p);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };

  const [reisetid, setReisetid] = useState("30 min");

  const goHjem = () => router.push("/");

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
          {steg + 1} av {antallSteg}
        </span>
        {steg < antallSteg - 1 ? (
          <button
            type="button"
            onClick={goHjem}
            style={{ fontSize: 10, color: C.soft, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Hopp over
          </button>
        ) : null}
      </div>
      <div
        className="sa"
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          maxWidth: 540,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {steg === 0 ? (
          <>
            <div className="fr" style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
              Velkommen til EiraNova 🌿
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Hei {fornavn}!</div>
            <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.7, marginBottom: 28 }}>
              Du er nå registrert som sykepleier hos EiraNova. La oss sette opp profilen din.
            </div>
          </>
        ) : null}
        {steg === 1 ? (
          <>
            <div className="fr" style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Din profesjonelle profil
            </div>
            <div style={{ fontSize: 11, color: C.soft, marginBottom: 16, lineHeight: 1.6 }}>
              Opplysningene brukes i planlegging og ved tildeling av oppdrag.
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
                HPR-nummer
              </label>
              <input
                className="inp"
                placeholder="7123456"
                value={hpr}
                onChange={(e) => setHpr(e.target.value.replace(/\D/g, "").slice(0, 9))}
              />
              <div style={{ fontSize: 9, color: C.soft, marginTop: 4 }}>Hentes fra Helsepersonellregisteret</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Tittel</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TITLER.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTittel(t)}
                    className="btn"
                    style={{
                      padding: "8px 12px",
                      fontSize: 11,
                      borderRadius: 50,
                      minHeight: 0,
                      background: tittel === t ? C.green : "white",
                      color: tittel === t ? "white" : C.navy,
                      border: `1.5px solid ${tittel === t ? C.green : C.border}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Spesialiteter</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SPEC_OPTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSpec(s)}
                    className="btn"
                    style={{
                      padding: "8px 12px",
                      fontSize: 11,
                      borderRadius: 50,
                      minHeight: 0,
                      background: spec.includes(s) ? C.greenBg : "white",
                      color: C.navy,
                      border: `1.5px solid ${spec.includes(s) ? C.green : C.border}`,
                    }}
                  >
                    {s}
                    {spec.includes(s) ? " ✓" : ""}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {steg === 2 ? (
          <>
            <div className="fr" style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Ditt dekningsområde
            </div>
            <div style={{ fontSize: 11, color: C.soft, marginBottom: 14, lineHeight: 1.6 }}>
              Velg kommuner du kan ta oppdrag i, og maksimal reisetid.
            </div>
            <div style={{ background: "white", borderRadius: 13, padding: "12px 14px", border: `1.5px solid ${C.border}`, marginBottom: 14 }}>
              {KOMM_NAVN.map((k) => (
                <label
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: k !== KOMM_NAVN[KOMM_NAVN.length - 1] ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.navy,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={kommSel.has(k)}
                    onChange={() => toggleKomm(k)}
                    style={{ accentColor: C.green, width: 18, height: 18 }}
                  />
                  {k}
                </label>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Maks reisetid</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {REISE_OPTS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReisetid(r)}
                  className="btn"
                  style={{
                    padding: "10px 8px",
                    fontSize: 11,
                    background: reisetid === r ? C.greenBg : "white",
                    color: C.navy,
                    border: `2px solid ${reisetid === r ? C.green : C.border}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </>
        ) : null}
        {steg === 3 ? (
          <>
            <div
              className="fr"
              style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8, textAlign: "center" }}
            >
              Alt er klart! 🎉
            </div>
            <div
              style={{
                background: "white",
                borderRadius: 13,
                padding: "14px 16px",
                border: `1.5px solid ${C.border}`,
                marginBottom: 14,
                fontSize: 11,
                color: C.navy,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.soft }}>HPR</span>
                <span style={{ fontWeight: 600 }}>{hpr || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.soft }}>Tittel</span>
                <span style={{ fontWeight: 600 }}>{tittel}</span>
              </div>
              <div style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.soft }}>Spesialiteter</span>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{spec.length ? spec.join(", ") : "—"}</div>
              </div>
              <div style={{ padding: "6px 0 0" }}>
                <span style={{ color: C.soft }}>Kommuner</span>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{[...kommSel].join(", ") || "—"}</div>
              </div>
              <div style={{ padding: "8px 0 0", fontSize: 10, color: C.soft }}>Maks reisetid: {reisetid}</div>
            </div>
            <div
              style={{
                background: C.greenXL,
                borderRadius: 12,
                padding: "12px 14px",
                border: `1px solid ${C.green}`,
                fontSize: 11,
                color: C.navyMid,
                lineHeight: 1.65,
                marginBottom: 8,
              }}
            >
              Din profil er sendt til godkjenning. Du vil motta e-post når du er godkjent.
            </div>
            <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.6 }}>
              Når du er godkjent: sjekk «Min arbeidsdag» for dagens oppdrag, bruk Innsjekk ved ankomst, og send korte
              meldinger til kunden via chat når det trengs.
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
            onClick={() => hpr.trim() && setSteg(2)}
            className="btn bp"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13, opacity: hpr.trim() ? 1 : 0.4 }}
          >
            Neste →
          </button>
        ) : null}
        {steg === 2 ? (
          <button
            type="button"
            onClick={() => kommSel.size && setSteg(3)}
            className="btn bp"
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: 14,
              borderRadius: 13,
              opacity: kommSel.size ? 1 : 0.4,
            }}
          >
            Neste →
          </button>
        ) : null}
        {steg === 3 ? (
          <button
            type="button"
            onClick={goHjem}
            className="btn bp"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, borderRadius: 13 }}
          >
            Gå til min arbeidsdag →
          </button>
        ) : null}
      </div>
    </div>
  );
}
