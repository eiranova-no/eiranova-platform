"use client";

import { OPPDRAG } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { NurseBottomNav } from "@/components/NurseBottomNav";
import { Bdg } from "@/components/nurse/Bdg";
import { NursePhoneHeader } from "@/components/nurse/NursePhoneHeader";
import { useNurseToast } from "@/components/nurse/useNurseToast";

const C = colors;

/** Match prototype-helper (linje 379–384). Lokal — kun brukt her, ingen delt fil. */
function nurseDefaultInnsjekkOppdragId(): string {
  const active = OPPDRAG.find((o) => o.status === "active");
  if (active) return String(active.id);
  const pending = OPPDRAG.find((o) => o.status !== "completed");
  return String(pending?.id ?? OPPDRAG[0]?.id ?? "1");
}

export function Innsjekk() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, ToastContainer } = useNurseToast();

  const idQuery = searchParams.get("id");
  const resolvedId =
    idQuery != null && idQuery !== "" ? idQuery : nurseDefaultInnsjekkOppdragId();
  const op = OPPDRAG.find((o) => String(o.id) === resolvedId) ?? OPPDRAG[0];

  const [done, setDone] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    setDone(false);
    setChecks([false, false, false, false, false]);
  }, [op.id]);

  const nesteEtter = OPPDRAG.filter(
    (o) => String(o.id) !== String(op.id) && o.status !== "completed",
  )[0];

  const notatTekst =
    op.id === "2"
      ? "Dør kode 1234. Pårørende: Kari (tlf. 900 12 345)."
      : `Besøk hos ${op.customer}. Meld fra til koordinator ved avvik.`;

  if (done) {
    return (
      <div className="phone fu">
        <ToastContainer />
        <NursePhoneHeader title="Oppdrag fullført" onBack={() => router.push("/")} />
        <div
          className="sa"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
          <div className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
            Oppdrag fullført!
          </div>
          <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.6, marginBottom: 22, maxWidth: 320 }}>
            Rapport sendt for {op.customer}.
            {nesteEtter
              ? ` Neste kl. ${nesteEtter.time} hos ${nesteEtter.customer}.`
              : " Du er ferdig med planlagte oppdrag i dag."}
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn bp bf"
            style={{ borderRadius: 11 }}
          >
            Tilbake til arbeidsdag
          </button>
        </div>
        <NurseBottomNav />
      </div>
    );
  }

  return (
    <div className="phone fu">
      <ToastContainer />
      <NursePhoneHeader
        title={`Innsjekk · ${op.customer}`}
        onBack={() => router.push("/oppdrag")}
      />
      <div className="sa" style={{ padding: 13 }}>
        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: op.cat === "barsel" ? C.goldBg : C.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {op.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{op.customer}</div>
              <div style={{ fontSize: 10, color: C.soft }}>
                {op.service} · {op.date} kl. {op.time}
              </div>
              <div style={{ fontSize: 10, color: C.soft, marginTop: 2 }}>📍 {op.address}</div>
              <div style={{ marginTop: 6 }}>
                <Bdg status={op.status} />
              </div>
            </div>
          </div>
          <div
            style={{
              background: C.greenXL,
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 11,
              color: C.navyMid,
              lineHeight: 1.6,
            }}
          >
            <strong>Notat:</strong> {notatTekst}
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                minWidth: 90,
                fontSize: 10,
                padding: "7px 0",
                background: C.greenBg,
                color: C.green,
                borderRadius: 8,
              }}
              onClick={() => toast(`Ringer ${op.phone}`, "ok")}
            >
              📞 Ring
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => router.push("/chat")}
              style={{
                flex: 1,
                minWidth: 90,
                fontSize: 10,
                padding: "7px 0",
                background: C.greenBg,
                color: C.green,
                borderRadius: 8,
              }}
            >
              💬 Chat
            </button>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                minWidth: 90,
                fontSize: 10,
                padding: "7px 0",
                background: C.greenBg,
                color: C.green,
                borderRadius: 8,
              }}
              onClick={() => toast("Åpner kart", "ok")}
            >
              🗺️ Kart
            </button>
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.navy,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 7,
          }}
        >
          Sjekkliste
        </div>
        {["Vasket kjøkken og bad", "Støvsuget stue", "Gjort klart middag", "Handleliste sjekket", "Medisin kontrollert"].map(
          (item, i) => (
            <div
              key={i}
              onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "white",
                borderRadius: 9,
                marginBottom: 5,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  border: `2px solid ${C.green}`,
                  background: checks[i] ? C.green : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {checks[i] && (
                  <span style={{ color: "white", fontSize: 11 }}>✓</span>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: checks[i] ? C.soft : C.navy,
                  textDecoration: checks[i] ? "line-through" : "none",
                }}
              >
                {item}
              </span>
            </div>
          ),
        )}
        <div style={{ marginTop: 14 }}>
          <label
            style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 5 }}
          >
            Rapport / Notater
          </label>
          <textarea
            className="inp"
            rows={3}
            placeholder="Beskriv gjennomføringen..."
            style={{ resize: "none", lineHeight: 1.5 }}
          />
        </div>
        <button
          type="button"
          onClick={() => setDone(true)}
          className="btn bp bf"
          style={{ borderRadius: 11, marginTop: 12 }}
        >
          ✅ Fullfør og send rapport
        </button>
      </div>
      <NurseBottomNav />
    </div>
  );
}
