"use client";

import { B2B_COORD_BRUKERE, PAKKER } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ModalPortal } from "@/components/screens/Landing/ModalPortal";
import { Bdg } from "@/components/screens/B2B/Bdg";

const C = colors;

function fornavn(fulleNavn: string): string {
  const første = fulleNavn.trim().split(/\s+/)[0];
  return første ?? fulleNavn;
}

export function B2BBruker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idQuery = searchParams.get("id");

  const resolvedId =
    idQuery && idQuery !== ""
      ? idQuery
      : (B2B_COORD_BRUKERE.find((b) => b.aktiv)?.id ?? B2B_COORD_BRUKERE[0]?.id ?? "u1");

  const bruker =
    B2B_COORD_BRUKERE.find((b) => b.id === resolvedId) ?? B2B_COORD_BRUKERE[0];

  const [ekstraModal, setEkstraModal] = useState(false);

  if (!bruker) {
    return (
      <div className="phone fu" style={{ padding: 24 }}>
        <p style={{ fontSize: 13, color: C.navy }}>Fant ikke bruker.</p>
      </div>
    );
  }

  const hilsen = `God dag, ${fornavn(bruker.name)}! 👋`;

  return (
    <div className="phone fu">
      <div
        style={{
          padding: "16px 14px 20px",
          background: "linear-gradient(160deg,#1A2E24,#2C5C52)",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>
          Moss Kommune · Din pleieplan
        </div>
        <div className="fr" style={{ fontSize: 19, fontWeight: 600, color: "white", marginBottom: 6 }}>
          {hilsen}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,.12)",
            borderRadius: 10,
            padding: "9px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.sidebarAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            SL
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "white" }}>
              Sara Lindgren er din faste sykepleier
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.6)" }}>Neste besøk: I morgen kl. 08:00</div>
          </div>
        </div>
      </div>

      <div className="sa" style={{ padding: 13 }}>
        <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 9 }}>
          Din ukesplan
        </div>
        <div className="card" style={{ marginBottom: 12 }}>
          {bruker.ukeplan.map((u, i) => (
            <div
              key={`${u.dag}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 13px",
                borderBottom: i < bruker.ukeplan.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ width: 32, textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.soft, textTransform: "uppercase" }}>
                  {u.dag}
                </div>
              </div>
              <div style={{ width: 1, height: 28, background: C.border }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{u.tjeneste}</div>
                <div style={{ fontSize: 9, color: C.soft }}>
                  {u.tid} · {u.sykepleier}
                </div>
              </div>
              <Bdg status={u.status} />
            </div>
          ))}
        </div>

        <div
          style={{
            background: C.greenXL,
            borderRadius: 12,
            padding: "12px 13px",
            border: `1px solid ${C.border}`,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div className="fr" style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
              Din pakke
            </div>
            <span
              style={{
                fontSize: 9,
                background: C.greenBg,
                color: C.green,
                padding: "2px 8px",
                borderRadius: 50,
                fontWeight: 600,
              }}
            >
              Ukespakke Pluss
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.55 }}>
            5x morgensstell + 3x praktisk bistand per uke. Betales av Moss Kommune.
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: C.navyMid, fontWeight: 500 }}>
            💡 Du kan legge til ekstratjenester når du trenger det
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEkstraModal(true)}
          className="btn bp"
          style={{ width: "100%", padding: "11px 0", fontSize: 12, borderRadius: 11, marginBottom: 8 }}
        >
          + Bestill ekstra tjeneste
        </button>
        <button
          type="button"
          onClick={() => router.push("/chat")}
          className="btn"
          style={{
            width: "100%",
            padding: "11px 0",
            fontSize: 12,
            borderRadius: 11,
            background: "white",
            color: C.green,
            border: `1.5px solid ${C.border}`,
          }}
        >
          <span>💬</span> Send melding til Sara
        </button>
      </div>

      {ekstraModal ? (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "18px 16px 28px",
              width: "100%",
              maxWidth: 420,
              maxHeight: "75vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
                Ekstra tjeneste
              </span>
              <button
                type="button"
                onClick={() => setEkstraModal(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.soft }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 10, color: C.soft, marginBottom: 12, lineHeight: 1.5 }}>
              Ekstrabestillinger faktureres til Moss Kommune på neste samlefaktura.
            </div>
            {PAKKER.filter((p) => !p.id.includes("ukespakke")).map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setEkstraModal(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEkstraModal(false);
                  }
                }}
                className="card"
                style={{
                  padding: "11px 12px",
                  marginBottom: 7,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
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
                    flexShrink: 0,
                  }}
                >
                  {p.ikon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{p.navn}</div>
                  <div style={{ fontSize: 9, color: C.soft }}>{p.beskrivelse}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sky }}>{p.pris} kr</div>
                </div>
              </div>
            ))}
          </div>
        </ModalPortal>
      ) : null}

      <nav className="bnav">
        {[
          { icon: "🏠", label: "Hjem" },
          { icon: "📋", label: "Mine avtaler" },
          { icon: "💬", label: "Meldinger" },
          { icon: "👤", label: "Profil" },
        ].map((it, i) => (
          <button key={it.label} type="button" className="bi">
            <span style={{ fontSize: 20 }}>{it.icon}</span>
            <span style={{ fontSize: 9, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.green : C.soft }}>
              {it.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
