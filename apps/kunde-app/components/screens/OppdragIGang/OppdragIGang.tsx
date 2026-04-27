"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { colors } from "@eiranova/ui";

import { ProfilHeader } from "../KundeProfil/KundeProfil";
import { useLandingToast } from "../Landing/useLandingToast";

const C = colors;

type OppdragFase = "på_vei" | "her" | "ferdig";

/**
 * Kunde: «Oppdrag pågår» (prototype `OppdragIGang` ~1299).
 */
export function OppdragIGang() {
  const router = useRouter();
  const { toast, ToastContainer } = useLandingToast();
  const [fase, setFase] = useState<OppdragFase>("på_vei");

  const onNav = useCallback(
    (id: string, _arg2?: unknown, meta?: { orderId?: string }) => {
      if (id === "bestill" && typeof _arg2 === "string") {
        void router.push(`/bestill?tjeneste=${encodeURIComponent(_arg2)}`);
        return;
      }
      const paths: Record<string, string> = {
        hjem: "/",
        bestill: "/bestill",
        mine: "/mine",
        "chat-kunde": "/chat",
        "kunde-profil": "/profil",
        "kunde-avtale-detalj": "/mine",
        "kunde-oppdrag-detalj": meta?.orderId ? `/mine?order=${encodeURIComponent(meta.orderId)}` : "/mine",
      };
      void router.push(paths[id] ?? "/");
    },
    [router],
  );

  return (
    <div className="phone fu" style={{ background: C.greenXL }}>
      <ToastContainer />
      <ProfilHeader
        title="Oppdrag pågår"
        onBack={() => onNav("hjem")}
        backLabel="Hjem"
        centerTitle
        slim
      />
      <div className="sa" style={{ padding: "14px 16px" }}>
        <div
          style={{
            background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
            borderRadius: 18,
            padding: "20px",
            marginBottom: 14,
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>
            {fase === "på_vei" ? "🚶" : fase === "her" ? "🏠" : "✅"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {fase === "på_vei" ? "Sara er på vei til deg" : fase === "her" ? "Sara er ankommet" : "Oppdraget er fullført"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)" }}>
            {fase === "på_vei"
              ? "Estimert ankomst: 5–10 min"
              : fase === "her"
                ? "Morgensstell · Startet 08:04"
                : "Morgensstell · 08:04–08:49 · 45 min"}
          </div>
          {fase === "på_vei" && (
            <div
              style={{
                marginTop: 14,
                background: "rgba(255,255,255,.12)",
                borderRadius: 10,
                padding: "10px",
                fontSize: 11,
                color: "rgba(255,255,255,.8)",
              }}
            >
              📍 Konggata 4 → Konggata 12 — ca 3 min
            </div>
          )}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "14px",
            marginBottom: 12,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            SL
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Sara Lindgren</div>
            <div style={{ fontSize: 10, color: C.soft }}>Autorisert sykepleier · ⭐ 4.9</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => toast("Ringer Sara...")}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: C.greenBg,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              📞
            </button>
            <button
              type="button"
              onClick={() => onNav("chat-kunde")}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: C.greenBg,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              💬
            </button>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "14px",
            marginBottom: 12,
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Status</div>
          {(
            [
              { fase: "bestilt" as const, label: "Bestilling bekreftet", tid: "07:30", done: true },
              { fase: "tilordnet" as const, label: "Sykepleier tilordnet", tid: "07:32", done: true },
              { fase: "på_vei" as const, label: "Sykepleier på vei", tid: "07:58", done: true },
              { fase: "her" as const, label: "Sykepleier ankommet", tid: "08:04", done: fase === "her" || fase === "ferdig" },
              { fase: "ferdig" as const, label: "Oppdrag fullført", tid: "08:49", done: fase === "ferdig" },
            ] as const
          ).map((s, i, arr) => (
            <div key={s.fase} style={{ display: "flex", gap: 10, paddingBottom: i < arr.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: s.done ? C.green : "#E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "white",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.done ? "✓" : ""}
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: s.done ? C.green : "#E5E7EB",
                      marginTop: 2,
                      minHeight: 12,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: s.done ? 600 : 400, color: s.done ? C.navy : C.soft }}>{s.label}</div>
                {s.done && <div style={{ fontSize: 9, color: C.soft }}>{s.tid}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {fase !== "ferdig" && (
            <button
              type="button"
              onClick={() => setFase((f) => (f === "på_vei" ? "her" : "ferdig"))}
              className="btn bp"
              style={{ flex: 1, padding: "10px 0", fontSize: 11, borderRadius: 10 }}
            >
              {fase === "på_vei" ? "Simuler: ankommet →" : "Simuler: fullført →"}
            </button>
          )}
          {fase === "ferdig" && (
            <button
              type="button"
              onClick={() => onNav("hjem")}
              className="btn bp"
              style={{ flex: 1, padding: "10px 0", fontSize: 12, borderRadius: 10 }}
            >
              ⭐ Gi vurdering
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
