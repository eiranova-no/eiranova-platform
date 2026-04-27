"use client";

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import type { KundeFacingService, MockOrder, OppdragEntry } from "@eiranova/mock-data";
import {
  BN_K,
  DEFAULT_KUNDE_SERVICES,
  mockKundeNesteAvtale,
  ORDERS,
} from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { useAuth } from "@/lib/auth/AuthProvider";

const C = colors;

function Bdg({ status }: { status: string }) {
  const M: Record<string, { l: string; bg: string; c: string }> = {
    completed: { l: "✓ Fullført", bg: C.greenBg, c: C.greenDark },
    active: { l: "● Aktiv", bg: C.greenBg, c: C.green },
    assigned: { l: "Tildelt", bg: C.skyBg, c: C.sky },
    confirmed: { l: "Bekreftet", bg: C.goldBg, c: C.goldDark },
    pending: { l: "Venter", bg: C.goldBg, c: C.goldDark },
    sent: { l: "Sendt", bg: C.skyBg, c: C.sky },
    overdue: { l: "⚠ Forfalt", bg: C.dangerBg, c: C.danger },
    paid: { l: "✓ Betalt", bg: C.greenBg, c: C.greenDark },
    upcoming: { l: "Kommende", bg: C.softBg, c: C.soft },
    on_assignment: { l: "● Aktiv", bg: C.greenBg, c: C.green },
    available: { l: "Ledig", bg: "#F0FDF4", c: "#16A34A" },
    break: { l: "Pause", bg: C.goldBg, c: C.goldDark },
    settled: { l: "✓ Innbetalt", bg: C.greenBg, c: C.greenDark },
    in_transit: { l: "→ Overføring", bg: C.skyBg, c: C.sky },
    cancelled: { l: "Avbestilt", bg: "#FFF1F2", c: "#BE123C" },
    avlyst: { l: "Avlyst", bg: "#FFF1F2", c: "#BE123C" },
    no_show: { l: "Uteblitt", bg: C.softBg, c: C.soft },
  };
  const b = M[status] ?? { l: status, bg: C.softBg, c: C.soft };
  return (
    <span className="badge" style={{ background: b.bg, color: b.c }}>
      {b.l}
    </span>
  );
}

function DeskNav({
  active,
  onNav,
  items,
  title,
  right,
}: {
  active: string;
  onNav: (id: string) => void;
  items: { id: string; icon: string; label: string }[];
  title?: string;
  right?: ReactNode;
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
      {right && (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>{right}</div>
      )}
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

function ModalPortal({ children, overlayStyle }: { children: ReactNode; overlayStyle?: CSSProperties }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const safePad =
    "max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))";
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: safePad,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...overlayStyle,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

function TjenesteMerinfoModal({
  service,
  accent,
  onClose,
  onFortsett,
  fortsettLabel,
}: {
  service: KundeFacingService | null;
  accent?: string;
  onClose: () => void;
  onFortsett?: (s: KundeFacingService) => void;
  fortsettLabel?: string;
}) {
  if (!service) return null;
  const ac = accent || (service.cat === "barsel" ? C.gold : C.green);
  return (
    <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.48)", padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          width: "100%",
          maxWidth: 400,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.22)",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
            borderRadius: "18px 18px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {service.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.25 }}>{service.name}</div>
              {service.tagline ? (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.72)", fontStyle: "italic", marginTop: 6, lineHeight: 1.45 }}>
                  {service.tagline}
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.15)",
              border: "none",
              color: "white",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Lukk"
          >
            ×
          </button>
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
            Hva inngår
          </div>
          {service.inkluderer && service.inkluderer.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: C.navyMid, lineHeight: 1.55 }}>
              {service.inkluderer.map((punkt, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {punkt}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: 12, color: C.soft, fontStyle: "italic" }}>Ingen punkter lagt inn ennå.</div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: C.soft }}>Pris · varighet</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ac }}>
                fra {service.price} kr · {service.duration} min
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 12,
                borderRadius: 10,
                background: "white",
                color: C.navy,
                border: `1.5px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Lukk
            </button>
            <button
              type="button"
              onClick={() => {
                onFortsett?.(service);
                onClose();
              }}
              className="btn bp"
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 12,
                borderRadius: 10,
                fontFamily: "inherit",
                fontWeight: 600,
                background: ac,
                border: `1px solid ${ac}`,
              }}
            >
              {fortsettLabel || "Fortsett"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export interface HjemProps {
  services?: KundeFacingService[];
  orders?: MockOrder[];
}

function hentInitialer(navn: string): string {
  const p = navn.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function formatDatoNb(): string {
  return new Date().toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Hjem({ services = DEFAULT_KUNDE_SERVICES, orders = ORDERS }: HjemProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [merinfo, setMerinfo] = useState<KundeFacingService | null>(null);

  const neste: OppdragEntry | undefined = mockKundeNesteAvtale();

  const displayName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user?.email?.split("@")[0] ||
    "kunde";
  const BN_ITEMS = BN_K;

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
        "kunde-avtale-detalj": "/mine?vis=avtale",
        "kunde-oppdrag-detalj": meta?.orderId ? `/mine?order=${encodeURIComponent(meta.orderId)}` : "/mine",
      };
      void router.push(paths[id] ?? "/");
    },
    [router],
  );

  return (
    <div className="phone fu">
      <DeskNav
        active="hjem"
        onNav={onNav}
        items={BN_ITEMS}
        title="EiraNova"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.soft }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: C.greenBg,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: C.green,
              }}
            >
              {hentInitialer(displayName)}
            </span>
            {displayName}
          </div>
        }
      />

      <div
        style={{
          padding: "clamp(14px,2vw,24px) clamp(14px,3vw,40px) clamp(18px,2.5vw,28px)",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="fr" style={{ fontSize: "clamp(18px,2.5vw,28px)", fontWeight: 600, color: "white", marginBottom: 2 }}>
              God dag, {displayName.split(" ")[0]}! 👋
            </div>
            <div style={{ fontSize: "clamp(10px,1vw,13px)", color: "rgba(255,255,255,.65)" }}>{formatDatoNb()}</div>
          </div>
          {neste && (
            <button
              type="button"
              onClick={() => onNav("kunde-avtale-detalj")}
              style={{
                background: "rgba(255,255,255,.12)",
                borderRadius: 12,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "1px solid rgba(255,255,255,.15)",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                color: "inherit",
                position: "relative",
                zIndex: 1,
                maxWidth: "100%",
                alignSelf: "center",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {neste.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "clamp(9px,.9vw,10px)",
                    color: "rgba(255,255,255,.5)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontWeight: 600,
                  }}
                >
                  Neste avtale
                </div>
                <div style={{ fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 600, color: "white" }}>{neste.service}</div>
                <div style={{ fontSize: "clamp(10px,1vw,12px)", color: "rgba(255,255,255,.7)" }}>
                  {neste.date} · kl. {neste.time}
                </div>
              </div>
              <span className="btn bp" style={{ fontSize: "clamp(10px,1vw,12px)", padding: "7px 14px", marginLeft: 8, flexShrink: 0, pointerEvents: "none" }}>
                Detaljer
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="sa" style={{ padding: "clamp(14px,2vw,28px) clamp(12px,3vw,40px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(16px,2.5vw,28px)" }}>
            <div className="fr" style={{ fontSize: "clamp(14px,1.5vw,18px)", fontWeight: 600, color: C.navy, marginBottom: "clamp(8px,1.5vw,14px)" }}>
              Bestill ny tjeneste
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,180px),1fr))",
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
                    style={{ cursor: "pointer", overflow: "hidden", transition: "all .15s" }}
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
                      <div style={{ fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 600, color: C.navy, marginBottom: 3, lineHeight: 1.3 }}>
                        {sv.name}
                      </div>
                      {sv.tagline ? (
                        <div style={{ fontSize: "clamp(8px,.85vw,10px)", color: C.soft, marginBottom: 5, lineHeight: 1.35, fontStyle: "italic" }}>
                          {sv.tagline}
                        </div>
                      ) : null}
                      <div style={{ fontSize: "clamp(9px,.9vw,11px)", color: C.soft, marginBottom: 6 }}>
                        fra {sv.price} kr · {sv.duration} min
                      </div>
                      <button
                        type="button"
                        className="btn bp"
                        style={{ width: "100%", fontSize: "clamp(9px,.9vw,11px)", padding: "5px 0", borderRadius: 7 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMerinfo(sv);
                        }}
                      >
                        Bestill
                      </button>
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
                <span style={{ fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 600, color: "#B05C4A", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Barselstøtte
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,180px),1fr))",
                  gap: "clamp(7px,1vw,12px)",
                  alignItems: "stretch",
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
                        cursor: "pointer",
                        border: `0.5px solid ${C.border}`,
                        transition: "all .15s",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        minHeight: 0,
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
                      <div style={{ padding: "clamp(10px,1.2vw,14px)", paddingBottom: 8, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                        <div style={{ fontSize: "clamp(18px,2vw,24px)", marginBottom: 6, flexShrink: 0 }}>{sv.icon}</div>
                        <div style={{ fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 600, color: C.navy, marginBottom: 3, flexShrink: 0 }}>
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
                              flexShrink: 0,
                            }}
                          >
                            {sv.tagline}
                          </div>
                        ) : null}
                        <div style={{ fontSize: "clamp(9px,.9vw,11px)", color: C.soft, flexShrink: 0 }}>
                          fra {sv.price} kr · {sv.duration} min
                        </div>
                        <button
                          type="button"
                          className="btn"
                          style={{
                            width: "100%",
                            fontSize: "clamp(9px,.9vw,11px)",
                            padding: "5px 0",
                            borderRadius: 7,
                            background: C.gold,
                            color: "white",
                            marginTop: "auto",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMerinfo(sv);
                          }}
                        >
                          Bestill
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div>
            <div className="fr" style={{ fontSize: "clamp(14px,1.5vw,18px)", fontWeight: 600, color: C.navy, marginBottom: "clamp(8px,1.5vw,14px)" }}>
              Mine bestillinger
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))", gap: "clamp(7px,1vw,12px)" }}>
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNav("kunde-oppdrag-detalj", null, { orderId: o.id })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onNav("kunde-oppdrag-detalj", null, { orderId: o.id });
                    }
                  }}
                  className="card"
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ height: 3, background: o.cat === "barsel" ? C.gold : C.green }} />
                  <div
                    style={{
                      padding: "clamp(9px,1vw,13px) clamp(11px,1.5vw,16px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "clamp(12px,1.2vw,14px)",
                          fontWeight: 600,
                          color: C.navy,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {o.service}
                      </div>
                      <div style={{ fontSize: "clamp(9px,.9vw,11px)", color: C.soft, marginTop: 2 }}>
                        {o.date} · {o.time} · {o.nurse}
                      </div>
                    </div>
                    <Bdg status={o.status} />
                  </div>
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
          onFortsett={(s) => onNav("bestill", s.type)}
          fortsettLabel="Gå til bestilling"
        />
      )}
      <BNav active="hjem" onNav={onNav} items={BN_ITEMS} />
    </div>
  );
}
