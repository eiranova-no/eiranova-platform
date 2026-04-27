"use client";

import { useState } from "react";

import type { KundeFacingService, MockNurse } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { LandB2BKontaktSeksjon } from "./LandB2BKontaktSeksjon";
import { TjenesteMerinfoModal } from "./TjenesteMerinfoModal";

const C = colors;

export interface LandKundeDesktopProps {
  services: KundeFacingService[];
  nurses: MockNurse[];
  onNavigate: (dest: "bestill" | "login") => void;
  onContinueToBestill: (service: KundeFacingService) => void;
}

export function LandKundeDesktop({
  services,
  nurses,
  onNavigate,
  onContinueToBestill,
}: LandKundeDesktopProps) {
  const [merinfo, setMerinfo] = useState<KundeFacingService | null>(null);

  return (
    <div className="land-desktop">
      <div
        className="land-hero-shell"
        style={{
          background: "linear-gradient(135deg,#1E3A2F 0%,#2C5C52 50%,#1a3028 100%)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          padding: "64px 40px",
        }}
      >
        <div
          className="land-hero-grid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                🤲
              </div>
              <div>
                <div className="fr" style={{ fontSize: 24, fontWeight: 600, color: "white", lineHeight: 1 }}>
                  Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontStyle: "italic" }}>Faglig trygghet. Menneskelig nærhet.</div>
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(232,164,164,.2)",
                border: "1px solid rgba(232,164,164,.4)",
                borderRadius: 50,
                padding: "5px 16px",
                marginBottom: 20,
                fontSize: 12,
                fontWeight: 500,
                color: "#F2C4C4",
              }}
            >
              ♡ Omsorg og støtte
            </div>
            <h1 className="fr" style={{ fontSize: 56, fontWeight: 600, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
              Omsorg levert
              <br />
              <em style={{ color: "#F2C4C4" }}>til din dør</em>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.82)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Profesjonelle helsetjenester i hjemmet for eldre og nybakte mødre — med autorisert helsepersonell i ditt nærområde.
            </p>
            <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
              <button type="button" className="btn bp" onClick={() => onNavigate("bestill")} style={{ padding: "15px 36px", fontSize: 16, borderRadius: 13 }}>
                Bestill nå
              </button>
              <button type="button" className="btn bg" onClick={() => onNavigate("login")} style={{ padding: "15px 28px", fontSize: 15, borderRadius: 13 }}>
                Logg inn
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["✓ Autorisert helsepersonell", "📍 7 kommuner i Østfold", "⭐ 4.9 av 5 · 1000+ oppdrag"].map((p) => (
                <div
                  key={p}
                  style={{
                    background: "rgba(255,255,255,.12)",
                    borderRadius: 50,
                    padding: "6px 16px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(255,255,255,.9)",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: 24,
                border: "1px solid rgba(255,255,255,.12)",
                backdropFilter: "blur(10px)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,.5)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                Tilgjengelig nå i ditt område
              </div>
              {nurses
                .filter((n) => n.status === "available")
                .slice(0, 2)
                .map((n) => (
                  <div
                    key={n.name}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {n.av}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 11,
                          height: 11,
                          borderRadius: "50%",
                          background: "#16A34A",
                          border: "2px solid rgba(30,58,47,.8)",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 1 }}>{n.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>
                        {n.tittel} · {n.erfaring}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, background: "rgba(22,163,74,.2)", color: "#4ade80", padding: "3px 10px", borderRadius: 50, fontWeight: 600 }}>Ledig</div>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => onNavigate("bestill")}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "11px 0",
                  background: C.green,
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Bestill time nå →
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {(
                [
                  ["4.9★", "Kundetilfredsh."],
                  ["1000+", "Oppdrag gjennomført"],
                  ["7", "Kommuner dekket"],
                ] as const
              ).map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,.07)",
                    borderRadius: 12,
                    padding: "12px 10px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div className="fr" style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 2 }}>
                    {v}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", lineHeight: 1.3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: C.cream, padding: "56px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="fr" style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              Våre tjenester
            </div>
            <div style={{ fontSize: 16, color: C.soft }}>Klikk på en tjeneste for detaljer og bestilling</div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🏡
              </div>
              <span className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy }}>
                Eldre & Pårørende
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {services
                .filter((s) => s.cat === "eldre")
                .map((sv) => (
                  <div
                    key={sv.type}
                    onClick={() => setMerinfo(sv)}
                    className="card"
                    style={{ cursor: "pointer", overflow: "hidden", transition: "all .18s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={{ height: 5, background: `linear-gradient(90deg,${C.green},${C.greenLight})` }} />
                    <div style={{ padding: 18 }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{sv.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{sv.name}</div>
                      {sv.tagline ? (
                        <div style={{ fontSize: 12, color: C.soft, marginBottom: 14, lineHeight: 1.45, fontStyle: "italic" }}>{sv.tagline}</div>
                      ) : (
                        <div style={{ marginBottom: 14 }} />
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>fra {sv.price} kr</span>
                        <span style={{ fontSize: 11, color: C.soft, background: C.softBg, padding: "2px 8px", borderRadius: 50 }}>{sv.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: C.rose,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤱
              </div>
              <span className="fr" style={{ fontSize: 20, fontWeight: 600, color: C.navy }}>
                Barselstøtte
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {services
                .filter((s) => s.cat === "barsel")
                .map((sv) => (
                  <div
                    key={sv.type}
                    onClick={() => setMerinfo(sv)}
                    className="card"
                    style={{ cursor: "pointer", overflow: "hidden", transition: "all .18s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={{ height: 5, background: `linear-gradient(90deg,${C.rose},${C.gold})` }} />
                    <div style={{ padding: 18 }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{sv.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{sv.name}</div>
                      {sv.tagline ? (
                        <div style={{ fontSize: 12, color: C.soft, marginBottom: 14, lineHeight: 1.45, fontStyle: "italic" }}>{sv.tagline}</div>
                      ) : (
                        <div style={{ marginBottom: 14 }} />
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>fra {sv.price} kr</span>
                        <span style={{ fontSize: 11, color: C.soft, background: C.softBg, padding: "2px 8px", borderRadius: 50 }}>{sv.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "white", padding: "56px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="fr" style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
                Møt våre sykepleiere
              </div>
              <div style={{ fontSize: 16, color: C.soft }}>Autorisert helsepersonell i ditt nærområde</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.greenBg, borderRadius: 50, padding: "7px 18px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
              <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>{nurses.filter((n) => n.status === "available").length} ledig nå</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginBottom: 28 }}>
            {nurses.map((n) => (
              <div key={n.name} className="card" style={{ padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${C.greenDark},${C.green})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
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
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: n.status === "available" ? "#16A34A" : n.status === "on_assignment" ? C.gold : C.soft,
                      border: "2.5px solid white",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{n.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <span>⭐</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{n.rating}</span>
                      <span style={{ fontSize: 11, color: C.soft }}>({n.antallOppdrag})</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 6 }}>
                    {n.tittel} · {n.erfaring}
                  </div>
                  <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.55, marginBottom: 10 }}>&quot;{n.bio}&quot;</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                    {n.spesialitet.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 10,
                          background: C.greenXL,
                          color: C.green,
                          padding: "3px 9px",
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
                    <span style={{ fontSize: 11, color: C.soft }}>📍 {n.omrade}</span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
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
              style={{
                padding: "13px 40px",
                background: C.green,
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Bestill en sykepleier →
            </button>
          </div>
        </div>
      </div>

      <LandB2BKontaktSeksjon variant="desktop" />

      <div style={{ background: C.navy, padding: "28px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white" }}>
            Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Fredrikstad", "Sarpsborg", "Moss", "Råde", "Vestby", "Ås", "Ski"].map((a) => (
              <div key={a} style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                📍 {a}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Powered by CoreX · EiraNova AS</div>
        </div>
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
