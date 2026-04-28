"use client";

import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

import { useLandingToast } from "@/components/screens/Landing/useLandingToast";

const C = colors;

export function IngenInvitasjon() {
  const router = useRouter();
  const { ToastContainer } = useLandingToast();

  return (
    <div className="phone fu">
      <ToastContainer />
      <div style={{ padding: "22px 18px 20px", background: `linear-gradient(160deg,${C.navy},${C.greenDark})` }}>
        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            background: "rgba(255,255,255,.16)",
            border: "none",
            color: "white",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 10,
          }}
        >
          ← Tilbake
        </button>
        <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 2 }}>
          Ikke mottatt invitasjon?
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Slik kommer du i gang</div>
      </div>
      <div className="sa" style={{ padding: "16px 18px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 13,
            padding: "14px 15px",
            marginBottom: 12,
            border: `1.5px solid ${C.green}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: C.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Er du privatperson?</div>
              <div style={{ fontSize: 10, color: C.soft }}>Du trenger ingen invitasjon</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.navyMid, lineHeight: 1.6, marginBottom: 10 }}>
            Private kunder oppretter konto selv. Logg inn, velg &quot;Privat kunde&quot; og registrer deg — alt er klart på
            få minutter.
          </div>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="btn bp"
            style={{ width: "100%", padding: "9px 0", fontSize: 11, borderRadius: 9 }}
          >
            Opprett privat konto →
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 13,
            padding: "14px 15px",
            marginBottom: 12,
            border: `1.5px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🏢
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Er du koordinator for en organisasjon?</div>
              <div style={{ fontSize: 10, color: C.soft }}>Tilgang gis av EiraNova</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.navyMid, lineHeight: 1.6, marginBottom: 10 }}>
            Koordinatortilgang kan ikke opprettes selv. Din organisasjon må ha en aktiv avtale med EiraNova, og du må
            inviteres personlig av en EiraNova-administrator.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(
              [
                {
                  t: "Har din organisasjon avtale med EiraNova?",
                  sub: "Ta kontakt for å komme i gang",
                  btn: "Ring oss: 900 12 345",
                  btnStyle: { background: C.green, color: "white" },
                },
                {
                  t: "Organisasjonen har avtale, men du er ikke invitert?",
                  sub: "Be din leder eller IT-kontakt ta kontakt med EiraNova",
                  btn: null,
                },
              ] as const
            ).map((s, i) => (
              <div key={i} style={{ background: C.softBg, borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 9, color: C.soft, marginBottom: s.btn ? 7 : 0, lineHeight: 1.5 }}>{s.sub}</div>
                {s.btn ? (
                  <button type="button" style={{ fontSize: 10, padding: "5px 13px", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, ...s.btnStyle }}>
                    {s.btn}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 13, padding: "14px 15px", border: `1.5px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              👴
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Er du pasient / bruker via kommune?</div>
              <div style={{ fontSize: 10, color: C.soft }}>Invitasjonen sendes av din koordinator</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.navyMid, lineHeight: 1.6, marginBottom: 10 }}>
            Din kommunekoordinator eller borettslagets kontaktperson legger deg til i systemet og sender invitasjonen. Ta
            kontakt med dem — ikke med EiraNova direkte.
          </div>
          <div
            style={{
              background: "#F5F3FF",
              borderRadius: 8,
              padding: "9px 11px",
              fontSize: 10,
              color: "#5B21B6",
              lineHeight: 1.5,
            }}
          >
            Sjekk søppelpost-mappen din — invitasjonen kan ha havnet der.
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
