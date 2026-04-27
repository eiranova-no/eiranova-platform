"use client";

import { useState } from "react";

import type { KundeFacingService, MockNurse } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { LandB2BKontaktSeksjon } from "./LandB2BKontaktSeksjon";
import { TjenesteMerinfoModal } from "./TjenesteMerinfoModal";

const C = colors;

export interface LandKundeMobileProps {
  services: KundeFacingService[];
  nurses: MockNurse[];
  onNavigate: (dest: "bestill" | "login") => void;
  onContinueToBestill: (service: KundeFacingService) => void;
}

export function LandKundeMobile({
  services,
  nurses,
  onNavigate,
  onContinueToBestill,
}: LandKundeMobileProps) {
  const [merinfo, setMerinfo] = useState<KundeFacingService | null>(null);

  return (
    <div className="land-kunde-mobile phone fu">
      <div
        style={{
          padding: "32px 18px 28px",
          background: "linear-gradient(160deg,#1E3A2F 0%,#2C5C52 60%,#1E3A2F 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,.14)",
              border: "1px solid rgba(255,255,255,.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🤲
          </div>
          <div>
            <div className="fr" style={{ fontSize: 20, fontWeight: 600, color: "white" }}>
              Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontStyle: "italic" }}>
              Faglig trygghet. Menneskelig nærhet.
            </div>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(232,164,164,.2)",
            border: "1px solid rgba(232,164,164,.35)",
            borderRadius: 50,
            padding: "3px 11px",
            marginBottom: 12,
            fontSize: 10,
            fontWeight: 500,
            color: "#F2C4C4",
          }}
        >
          ♡ Omsorg og støtte
        </div>
        <h1 className="fr" style={{ fontSize: 27, fontWeight: 600, color: "white", lineHeight: 1.2, marginBottom: 10 }}>
          Omsorg levert
          <br />
          <em style={{ color: "#F2C4C4" }}>til din dør</em>
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.6, marginBottom: 18 }}>
          Profesjonelle helsetjenester i hjemmet for eldre og nybakte mødre.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            type="button"
            className="btn bp"
            onClick={() => onNavigate("bestill")}
            style={{ flex: 1, minHeight: 48, padding: "12px 0", fontSize: 14, borderRadius: 11 }}
          >
            Bestill nå
          </button>
          <button
            type="button"
            className="btn bg"
            onClick={() => onNavigate("login")}
            style={{ flex: 1, minHeight: 48, padding: "12px 0", fontSize: 14, borderRadius: 11 }}
          >
            Logg inn
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["✓ Autorisert", "📍 7 kommuner", "⭐ 4.9/5"].map((p) => (
            <div
              key={p}
              style={{
                background: "rgba(255,255,255,.15)",
                borderRadius: 50,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 500,
                color: "white",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
      <div className="sa" style={{ background: C.cream }}>
        <div style={{ padding: "16px 14px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              🏡
            </div>
            <span className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
              Eldre & Pårørende
            </span>
          </div>
          {services
            .filter((s) => s.cat === "eldre")
            .map((sv) => (
              <div
                key={sv.type}
                onClick={() => setMerinfo(sv)}
                className="card"
                style={{
                  marginBottom: 6,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: C.greenBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    flexShrink: 0,
                  }}
                >
                  {sv.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{sv.name}</div>
                  {sv.tagline ? (
                    <div
                      style={{
                        fontSize: 10,
                        color: C.soft,
                        fontStyle: "italic",
                        lineHeight: 1.35,
                        marginTop: 2,
                      }}
                    >
                      {sv.tagline}
                    </div>
                  ) : null}
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: C.green, flexShrink: 0 }}>
                  fra {sv.price} kr
                </div>
              </div>
            ))}
        </div>
        <div
          style={{
            margin: "4px 14px 14px",
            background: "linear-gradient(135deg,#FDF0F0,#FDF5EE)",
            borderRadius: 14,
            padding: 13,
            border: "0.5px solid #F2C4C4",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: C.rose,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🤱
            </div>
            <span className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
              Barselstøtte
            </span>
          </div>
          {services
            .filter((s) => s.cat === "barsel")
            .map((sv) => (
              <div
                key={sv.type}
                onClick={() => setMerinfo(sv)}
                style={{
                  background: "white",
                  borderRadius: 8,
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 5,
                  cursor: "pointer",
                  border: `0.5px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 14 }}>{sv.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.navy, flex: 1, minWidth: 0 }}>
                  {sv.name}
                  {sv.tagline ? (
                    <span
                      style={{
                        display: "block",
                        fontSize: 9,
                        color: C.soft,
                        fontStyle: "italic",
                        fontWeight: 400,
                        marginTop: 2,
                        lineHeight: 1.35,
                      }}
                    >
                      {sv.tagline}
                    </span>
                  ) : null}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: C.gold, fontWeight: 500, flexShrink: 0 }}>
                  fra {sv.price} kr
                </span>
              </div>
            ))}
        </div>
        <div style={{ padding: "0 14px 20px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.green,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Tilgjengelig i:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {["Fredrikstad", "Sarpsborg", "Moss", "Råde", "Vestby", "Ås", "Ski"].map((a) => (
              <div
                key={a}
                style={{
                  background: "white",
                  border: `0.5px solid ${C.border}`,
                  borderRadius: 50,
                  padding: "3px 9px",
                  fontSize: 10,
                  color: C.navy,
                }}
              >
                📍 {a}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", padding: "22px 14px 28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                Møt våre sykepleiere
              </div>
              <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.45 }}>Autorisert helsepersonell i ditt nærområde</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: C.greenBg,
                borderRadius: 50,
                padding: "6px 14px",
                flexShrink: 0,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
              <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>
                {nurses.filter((n) => n.status === "available").length} ledig nå
              </span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 20 }}>
            {nurses.map((n) => (
              <div key={n.name} className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "white",
                      border: `3px solid ${C.greenBg}`,
                    }}
                  >
                    {n.av}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: n.status === "available" ? "#16A34A" : n.status === "on_assignment" ? C.gold : C.soft,
                      border: "2.5px solid white",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{n.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <span>⭐</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{n.rating}</span>
                      <span style={{ fontSize: 10, color: C.soft }}>({n.antallOppdrag})</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 6 }}>
                    {n.tittel} · {n.erfaring}
                  </div>
                  <div style={{ fontSize: 11, color: C.soft, lineHeight: 1.55, marginBottom: 8 }}>&quot;{n.bio}&quot;</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                    {n.spesialitet.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 9,
                          background: C.greenXL,
                          color: C.green,
                          padding: "3px 8px",
                          borderRadius: 5,
                          fontWeight: 500,
                          border: `0.5px solid ${C.border}`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: C.soft }}>📍 {n.omrade}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "3px 9px",
                        borderRadius: 50,
                        fontWeight: 600,
                        background: n.status === "available" ? "#F0FDF4" : n.status === "on_assignment" ? C.goldBg : C.softBg,
                        color: n.status === "available" ? "#16A34A" : n.status === "on_assignment" ? C.goldDark : C.soft,
                      }}
                    >
                      {n.status === "available" ? "Ledig nå" : n.status === "on_assignment" ? "På oppdrag" : "Pause"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="btn bp"
              style={{
                width: "100%",
                maxWidth: 400,
                margin: "0 auto",
                display: "block",
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Bestill en sykepleier →
            </button>
          </div>
        </div>
        <LandB2BKontaktSeksjon variant="mobile" />
      </div>
      {merinfo ? (
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat === "barsel" ? C.gold : C.green}
          onClose={() => setMerinfo(null)}
          onFortsett={onContinueToBestill}
          fortsettLabel="Bestill denne tjenesten"
        />
      ) : null}
    </div>
  );
}
