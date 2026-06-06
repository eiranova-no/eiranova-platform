"use client";

import {
  NURSE_PROFIL_MOCK_INDEKS,
  NURSE_PROFIL_OMRADE_CHIPS,
  NURSE_PROFIL_SPESIALITETER_CHIPS,
  NURSE_TITTEL_OPTIONS,
  NURSES,
  parseErfaringAar,
  profilEndringSammendrag,
  sykepleierOmradeTilChips,
  type NurseProfileLike,
} from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { NurseBottomNav } from "@/components/NurseBottomNav";
import { NursePhoneHeader } from "@/components/nurse/NursePhoneHeader";
import { useNurseToast } from "@/components/nurse/useNurseToast";
import { useAuth } from "@/lib/auth/useAuth";

const C = colors;

function toggleChip(setFn: Dispatch<SetStateAction<Set<string>>>, val: string): void {
  setFn((prev) => {
    const next = new Set(prev);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  });
}

export function Profil() {
  const router = useRouter();
  const { signOutMock } = useAuth();
  const { toast, ToastContainer } = useNurseToast();

  const idx = NURSE_PROFIL_MOCK_INDEKS;
  const nurses = NURSES;
  const n = nurses[idx] ?? nurses[0];

  const [profilBildeMock, setProfilBildeMock] = useState(false);
  const [bio, setBio] = useState(() => String(n?.bio ?? "").slice(0, 150));
  const [tittel, setTittel] = useState(() => {
    const tit = n?.tittel ?? "";
    return NURSE_TITTEL_OPTIONS.some((x) => x === tit) ? tit : NURSE_TITTEL_OPTIONS[0];
  });
  const [erfaringAar, setErfaringAar] = useState(() => parseErfaringAar(n?.erfaring) || 5);
  const [spes, setSpes] = useState(
    () =>
      new Set(
        (n?.spesialitet ?? []).filter((s): s is string =>
          NURSE_PROFIL_SPESIALITETER_CHIPS.includes(s as (typeof NURSE_PROFIL_SPESIALITETER_CHIPS)[number]),
        ),
      ),
  );
  const [omr, setOmr] = useState(
    () =>
      new Set(
        sykepleierOmradeTilChips(n?.omrade).filter((o) =>
          NURSE_PROFIL_OMRADE_CHIPS.includes(o as (typeof NURSE_PROFIL_OMRADE_CHIPS)[number]),
        ),
      ),
  );

  useEffect(() => {
    const nn = nurses[idx] ?? nurses[0];
    if (!nn) return;
    setBio(String(nn.bio ?? "").slice(0, 150));
    setTittel(
      NURSE_TITTEL_OPTIONS.some((x) => x === nn.tittel) ? nn.tittel : NURSE_TITTEL_OPTIONS[0],
    );
    setErfaringAar(parseErfaringAar(nn.erfaring) || 0);
    setSpes(
      new Set(
        (nn.spesialitet ?? []).filter((s): s is string =>
          NURSE_PROFIL_SPESIALITETER_CHIPS.includes(s as (typeof NURSE_PROFIL_SPESIALITETER_CHIPS)[number]),
        ),
      ),
    );
    setOmr(
      new Set(
        sykepleierOmradeTilChips(nn.omrade).filter((o) =>
          NURSE_PROFIL_OMRADE_CHIPS.includes(o as (typeof NURSE_PROFIL_OMRADE_CHIPS)[number]),
        ),
      ),
    );
  }, [nurses, idx]);

  const lagre = (): void => {
    if (!n) return;
    const erfaringStr = `${erfaringAar} år`;
    const spesArr = [...spes];
    const omrStr = [...omr].join(" / ");
    const apply: NurseProfileLike = {
      bio: bio.trim().slice(0, 150),
      tittel,
      erfaring: erfaringStr,
      spesialitet: spesArr,
      omrade: omrStr || n.omrade,
    };
    void profilEndringSammendrag(n, apply);
    toast("Profil sendt til godkjenning. Vi vil gjennomgå endringene dine.", "ok");
  };

  return (
    <div className="phone fu">
      <ToastContainer />
      <NursePhoneHeader title="Min profil" onBack={() => router.push("/")} />
      <div className="sa" style={{ padding: 14 }}>
        <div className="card cp" style={{ marginBottom: 12, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: profilBildeMock ? `linear-gradient(135deg,${C.sky},${C.green})` : `linear-gradient(135deg,${C.greenDark},${C.green})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                margin: "0 auto",
                border: `3px solid ${C.greenBg}`,
              }}
            >
              {profilBildeMock ? "🖼" : n.av}
            </div>
          </div>
          <div className="fr" style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
            {n.name}
          </div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 500, marginBottom: 6 }}>
            {n.tittel} · {n.erfaring} erfaring
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>
                {n.rating}
              </div>
              <div style={{ fontSize: 9, color: C.soft }}>Rating</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>
                {n.antallOppdrag}
              </div>
              <div style={{ fontSize: 9, color: C.soft }}>Oppdrag</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>
                5
              </div>
              <div style={{ fontSize: 9, color: C.soft }}>År hos EiraNova</div>
            </div>
          </div>
          <div style={{ background: C.greenXL, borderRadius: 8, padding: "6px 10px", fontSize: 10, color: C.soft }}>
            📍 {n.omrade} · {n.sertifisert ? "✓ Autorisert helsepersonell" : null}
          </div>
        </div>

        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Om meg (slik kunder ser deg nå)</div>
          <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.6, fontStyle: "italic" }}>&quot;{n.bio}&quot;</div>
        </div>

        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Rediger profil</div>
          <div style={{ marginBottom: 14, textAlign: "center" }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: C.soft,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Profilbilde
            </div>
            <button
              type="button"
              onClick={() => setProfilBildeMock(true)}
              className="btn"
              style={{
                padding: "8px 14px",
                fontSize: 10,
                borderRadius: 8,
                background: C.greenXL,
                color: C.greenDark,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Last opp bilde
            </button>
            <div style={{ fontSize: 9, color: C.soft, marginTop: 6, lineHeight: 1.4 }}>
              Mock — bilde lagres ikke. Viser placeholder etter «opplasting».
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              Kort beskrivelse{" "}
              <span style={{ fontWeight: 400, color: C.soft }}>(maks 150 tegn)</span>
            </label>
            <textarea
              className="inp"
              value={bio}
              maxLength={150}
              onChange={(e) => setBio(e.target.value.slice(0, 150))}
              rows={3}
              style={{ resize: "none", lineHeight: 1.5 }}
            />
            <div style={{ fontSize: 9, color: C.soft, textAlign: "right", marginTop: 3 }}>{bio.length}/150</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              Tittel
            </label>
            <select
              className="inp"
              value={tittel}
              onChange={(e) => setTittel(e.target.value)}
              style={{ fontSize: 12, fontFamily: "inherit", width: "100%" }}
            >
              {NURSE_TITTEL_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
              Antall års erfaring
            </label>
            <input
              className="inp"
              type="number"
              min={0}
              max={60}
              value={erfaringAar}
              onChange={(e) => setErfaringAar(Math.min(60, Math.max(0, Number.parseInt(e.target.value, 10) || 0)))}
              style={{ fontSize: 12 }}
            />
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Spesialiteter</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {NURSE_PROFIL_SPESIALITETER_CHIPS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleChip(setSpes, s)}
                style={{
                  fontSize: 10,
                  padding: "5px 10px",
                  borderRadius: 50,
                  border: `1.5px solid ${spes.has(s) ? C.green : C.border}`,
                  background: spes.has(s) ? C.greenBg : "white",
                  color: spes.has(s) ? C.greenDark : C.navyMid,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Dekningsområde</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {NURSE_PROFIL_OMRADE_CHIPS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleChip(setOmr, o)}
                style={{
                  fontSize: 10,
                  padding: "5px 10px",
                  borderRadius: 50,
                  border: `1.5px solid ${omr.has(o) ? C.green : C.border}`,
                  background: omr.has(o) ? C.greenBg : "white",
                  color: omr.has(o) ? C.greenDark : C.navyMid,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <button type="button" onClick={lagre} className="btn bp bf" style={{ width: "100%", borderRadius: 10, fontSize: 12 }}>
            Lagre endringer
          </button>
        </div>

        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Spesialiteter (godkjent)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {n.spesialitet.map((s: string) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  background: C.greenBg,
                  color: C.green,
                  padding: "5px 11px",
                  borderRadius: 50,
                  fontWeight: 500,
                  border: `1px solid ${C.border}`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Språk</div>
          <div style={{ display: "flex", gap: 6 }}>
            {n.språk.map((s: string) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  background: C.softBg,
                  color: C.navyMid,
                  padding: "5px 11px",
                  borderRadius: 50,
                  fontWeight: 500,
                }}
              >
                🗣 {s}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            background: C.greenXL,
            borderRadius: 10,
            padding: "10px 13px",
            border: `1px solid ${C.border}`,
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: C.green, marginBottom: 4 }}>👁 Slik ser kunder deg</div>
          <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.55 }}>
            Navn, tittel, erfaring, bio, spesialiteter og rating er synlig for kunder ved bestilling. Kontaktinfo og
            personopplysninger er aldri synlig.
          </div>
        </div>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px",
            background: "white",
            border: `1.5px solid ${C.danger}`,
            borderRadius: 10,
            fontSize: 11,
            color: C.danger,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          Meld deg utilgjengelig i dag
        </button>
        <button
          type="button"
          onClick={() => {
            signOutMock();
            router.push("/login");
          }}
          className="btn"
          style={{
            width: "100%",
            marginTop: 12,
            padding: "12px 0",
            fontSize: 13,
            borderRadius: 11,
            background: "white",
            color: C.navy,
            border: `1.5px solid ${C.border}`,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          Logg ut
        </button>
        <div style={{ height: 16 }} />
      </div>
      <NurseBottomNav />
    </div>
  );
}
