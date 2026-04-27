"use client";

import { useState } from "react";

import type { KundeFacingService } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { TjenesteMerinfoModal } from "../Landing/TjenesteMerinfoModal";
import { ProfilHeader } from "../KundeProfil/KundeProfil";

const C = colors;

function DeskNav({
  active,
  onNav,
  items,
  title,
}: {
  active: string;
  onNav: (id: string) => void;
  items: { id: string; icon: string; label: string }[];
  title?: string;
}) {
  return (
    <nav className="desk-nav">
      {title && (
        <div
          className="fr"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.navy,
            marginRight: 16,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            maxWidth: "min(280px,42vw)",
            flex: "0 1 auto",
          }}
        >
          {title}
        </div>
      )}
      {items.map((it) => (
        <button
          type="button"
          key={it.id + it.label}
          className={`desk-nav-item${active === it.id ? " on" : ""}`}
          onClick={() => onNav(it.id)}
        >
          <span style={{ marginRight: 5, fontSize: 14 }}>{it.icon}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

function BNav({
  active,
  onNav,
  items,
}: {
  active: string;
  onNav: (id: string) => void;
  items: { id: string; icon: string; label: string }[];
}) {
  return (
    <nav className="bnav">
      {items.map((it) => (
        <button type="button" key={it.id + it.label} className="bi" onClick={() => onNav(it.id)}>
          <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden>
            {it.icon}
          </span>
          <span className="bi-lbl" style={{ fontWeight: active === it.id ? 600 : 400, color: active === it.id ? C.green : C.soft }}>
            {it.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export type BestillKundeNav = (id: string, _arg2?: unknown, meta?: { orderId?: string }) => void;

export interface BestillSteg1TjenesteProps {
  services: KundeFacingService[];
  navItems: { id: string; icon: string; label: string }[];
  onNav: BestillKundeNav;
  onVelgTjeneste: (sv: KundeFacingService) => void;
}

/**
 * Steg 1/3: velg tjeneste (prototype Bestill steg 0).
 */
export function BestillSteg1Tjeneste({ services, navItems, onNav, onVelgTjeneste }: BestillSteg1TjenesteProps) {
  const [merinfo, setMerinfo] = useState<KundeFacingService | null>(null);

  return (
    <div className="phone fu">
      <ProfilHeader title="" onBack={() => onNav("hjem")} backLabel="Hjem" />
      <div className="sa" style={{ padding: "clamp(14px,2vw,28px) clamp(12px,3vw,40px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div
            className="fr"
            style={{
              fontSize: "clamp(14px,1.5vw,18px)",
              fontWeight: 600,
              color: C.navy,
              marginBottom: "clamp(8px,1.5vw,14px)",
              textAlign: "center",
              width: "100%",
            }}
          >
            Hvilken tjeneste ønsker du?
          </div>
          <div
            style={{
              display: "grid",
              width: "100%",
              alignItems: "stretch",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,200px), 1fr))",
              gap: "clamp(8px,1.2vw,14px)",
              marginBottom: "clamp(12px,1.5vw,20px)",
            }}
          >
            {services
              .filter((s) => s.cat === "eldre")
              .map((sv) => (
                <div
                  key={sv.type}
                  role="button"
                  tabIndex={0}
                  onClick={() => setMerinfo(sv)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setMerinfo(sv);
                    }
                  }}
                  className="card"
                  style={{
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all .15s",
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    style={{
                      height: "clamp(48px,6vw,64px)",
                      background: C.greenBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(20px,2.5vw,28px)",
                    }}
                  >
                    {sv.icon}
                  </div>
                  <div style={{ padding: "clamp(8px,1vw,12px)" }}>
                    <div
                      style={{
                        fontSize: "clamp(11px,1.1vw,13px)",
                        fontWeight: 600,
                        color: C.navy,
                        marginBottom: 3,
                        lineHeight: 1.3,
                      }}
                    >
                      {sv.name}
                    </div>
                    {sv.tagline ? (
                      <div
                        style={{
                          fontSize: "clamp(8px,.85vw,10px)",
                          color: C.soft,
                          marginBottom: 5,
                          lineHeight: 1.35,
                          fontStyle: "italic",
                        }}
                      >
                        {sv.tagline}
                      </div>
                    ) : null}
                    <div style={{ fontSize: "clamp(9px,.9vw,11px)", color: C.soft, marginBottom: 6 }}>
                      fra {sv.price} kr · {sv.duration} min
                    </div>
                    <span
                      className="btn bp"
                      role="button"
                      tabIndex={0}
                      style={{
                        display: "block",
                        width: "100%",
                        fontSize: "clamp(9px,.9vw,11px)",
                        padding: "5px 0",
                        borderRadius: 7,
                        textAlign: "center",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMerinfo(sv);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setMerinfo(sv);
                        }
                      }}
                    >
                      Velg
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              background: "linear-gradient(135deg,#FDF0F0,#FDF5EE)",
              borderRadius: 14,
              padding: "clamp(12px,1.5vw,18px)",
              border: "0.5px solid #F2C4C4",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "clamp(8px,1vw,12px)" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: C.rose,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                🤱
              </div>
              <span
                style={{
                  fontSize: "clamp(11px,1.2vw,13px)",
                  fontWeight: 600,
                  color: "#B05C4A",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                Barselstøtte
              </span>
            </div>
            <div
              style={{
                display: "grid",
                width: "100%",
                alignItems: "stretch",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,200px), 1fr))",
                gap: "clamp(7px,1vw,12px)",
              }}
            >
              {services
                .filter((s) => s.cat === "barsel")
                .map((sv) => (
                  <div
                    key={sv.type}
                    role="button"
                    tabIndex={0}
                    onClick={() => setMerinfo(sv)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setMerinfo(sv);
                      }
                    }}
                    style={{
                      background: "white",
                      borderRadius: 10,
                      padding: "clamp(10px,1.2vw,14px)",
                      cursor: "pointer",
                      border: `0.5px solid ${C.border}`,
                      transition: "all .15s",
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={{ fontSize: "clamp(18px,2vw,24px)", marginBottom: 6 }}>{sv.icon}</div>
                    <div style={{ fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 600, color: C.navy, marginBottom: 3 }}>{sv.name}</div>
                    {sv.tagline ? (
                      <div
                        style={{
                          fontSize: "clamp(8px,.85vw,10px)",
                          color: C.soft,
                          marginBottom: 5,
                          lineHeight: 1.35,
                          fontStyle: "italic",
                        }}
                      >
                        {sv.tagline}
                      </div>
                    ) : null}
                    <div style={{ fontSize: "clamp(9px,.9vw,11px)", color: C.soft, marginBottom: 8 }}>
                      fra {sv.price} kr · {sv.duration} min
                    </div>
                    <span
                      className="btn"
                      role="button"
                      tabIndex={0}
                      style={{
                        display: "block",
                        width: "100%",
                        fontSize: "clamp(9px,.9vw,11px)",
                        padding: "5px 0",
                        borderRadius: 7,
                        background: C.gold,
                        color: "white",
                        textAlign: "center",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMerinfo(sv);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setMerinfo(sv);
                        }
                      }}
                    >
                      Velg
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {merinfo && (
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat === "barsel" ? C.gold : C.green}
          onClose={() => setMerinfo(null)}
          onFortsett={(s) => {
            onVelgTjeneste(s);
            setMerinfo(null);
          }}
          fortsettLabel="Velg denne tjenesten"
        />
      )}
      <BNav active="bestill" onNav={onNav} items={navItems} />
      <DeskNav active="bestill" onNav={onNav} items={navItems} title="EiraNova" />
    </div>
  );
}
