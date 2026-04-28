"use client";

import { OPPDRAG } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

import { NurseBottomNav } from "@/components/NurseBottomNav";
import { Bdg } from "@/components/nurse/Bdg";
import { NurseDeskNav } from "@/components/nurse/NurseDeskNav";
import { useNurseToast } from "@/components/nurse/useNurseToast";

const C = colors;

export function Hjem() {
  const router = useRouter();
  const { toast, ToastContainer } = useNurseToast();

  const done = OPPDRAG.filter((o) => o.status === "completed").length;
  const neste = OPPDRAG.find((o) => o.status !== "completed");

  const deskRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.soft, flexShrink: 0 }}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: C.sidebarAccent,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "white",
        }}
      >
        SL
      </span>
      <span className="hm" style={{ whiteSpace: "nowrap" }}>
        Sara Lindgren
      </span>
    </div>
  );

  return (
    <div className="phone fu">
      <ToastContainer />
      <NurseDeskNav active="nurse-hjem" title="EiraNova · Sara Lindgren" right={deskRight} />
      <div
        style={{
          padding: "clamp(14px,2vw,24px) clamp(14px,3vw,32px)",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div className="fr" style={{ fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 600, color: "white" }}>
                Min arbeidsdag
              </div>
              <div style={{ fontSize: "clamp(10px,1vw,13px)", color: "rgba(255,255,255,.6)" }}>
                Mandag 3. mars · Sara L.
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              SL
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 10, padding: "10px 14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "clamp(10px,1vw,12px)",
                color: "rgba(255,255,255,.7)",
                marginBottom: 6,
              }}
            >
              <span>Progresjon i dag</span>
              <span>
                {done}/{OPPDRAG.length} oppdrag
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 50, background: "rgba(255,255,255,.2)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 50,
                  background: C.sidebarAccent,
                  width: `${(done / OPPDRAG.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="sa" style={{ padding: "clamp(13px,2vw,28px) clamp(13px,3vw,32px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.soft,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Neste oppdrag
          </div>
          {neste ? (
            <div
              className="nc"
              style={{ cursor: "pointer", marginBottom: 12 }}
              onClick={() => router.push(`/innsjekk?id=${encodeURIComponent(neste.id)}`)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: neste.cat === "barsel" ? C.goldBg : C.greenBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {neste.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "clamp(13px,1.3vw,15px)", fontWeight: 600, color: C.navy }}>
                      {neste.customer}
                    </span>
                    <Bdg status={neste.status} />
                  </div>
                  <div style={{ fontSize: 12, color: C.soft, marginBottom: 2 }}>{neste.service}</div>
                  <div style={{ fontSize: 12, color: C.navyMid }}>
                    🕐 {neste.date} kl. {neste.time}
                  </div>
                  <div style={{ fontSize: 11, color: C.soft, marginTop: 4 }}>📍 {neste.address}</div>
                </div>
              </div>
              {neste.status === "active" ? (
                <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn bp"
                    style={{
                      flex: 1,
                      minWidth: 120,
                      fontSize: "clamp(10px,1vw,12px)",
                      padding: "8px 0",
                      borderRadius: 9,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("Åpner navigasjon", "ok");
                    }}
                  >
                    📍 Naviger
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/chat");
                    }}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      fontSize: "clamp(10px,1vw,12px)",
                      padding: "8px 0",
                      borderRadius: 9,
                      background: C.greenBg,
                      color: C.green,
                    }}
                  >
                    💬 Melding
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="card cp" style={{ marginBottom: 12, fontSize: 13, color: C.soft }}>
              Ingen åpne oppdrag igjen i dag ✓
            </div>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => router.push("/oppdrag")}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 13,
              borderRadius: 11,
              background: "white",
              color: C.green,
              border: `1.5px solid ${C.green}`,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Se alle dagens oppdrag →
          </button>
        </div>
      </div>
      <NurseBottomNav />
    </div>
  );
}
