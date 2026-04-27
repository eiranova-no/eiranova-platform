"use client";

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { BN_K } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useLandingToast } from "../Landing/useLandingToast";

const C = colors;

type Fane = "profil" | "betaling" | "personvern";

function ProfilHeader({
  title,
  onBack,
  backLabel,
  centerTitle = false,
}: {
  title: string;
  onBack: () => void;
  backLabel: string;
  centerTitle?: boolean;
}) {
  const titleStr = String(title);
  const showTitle = titleStr.trim().length > 0;
  const backLabelTrim = String(backLabel).trim();
  const showBackLabel = backLabelTrim.length > 0;
  const titleStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    lineHeight: 1.25,
    overflowWrap: "anywhere" as const,
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: `linear-gradient(135deg,${C.navy},${C.greenDark})`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, zIndex: 1 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "rgba(255,255,255,.18)",
            border: "none",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-label="Tilbake"
        >
          ‹
        </button>
        {showBackLabel && (
          <span className="fr" style={{ ...titleStyle, flexShrink: 0 }}>
            {backLabelTrim}
          </span>
        )}
      </div>
      {centerTitle && showTitle ? (
        <span
          className="fr"
          style={{
            ...titleStyle,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            boxSizing: "border-box",
            paddingLeft: showBackLabel ? 200 : 52,
            paddingRight: 52,
          }}
        >
          {titleStr}
        </span>
      ) : showTitle ? (
        <span className="fr" style={{ ...titleStyle, flex: 1, minWidth: 0 }}>
          {titleStr}
        </span>
      ) : (
        <span style={{ flex: 1, minWidth: 0 }} aria-hidden />
      )}
    </div>
  );
}

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

function hentInitialer(navn: string): string {
  const p = navn.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

const BN_ITEMS = BN_K;

export function KundeProfil() {
  const router = useRouter();
  const { toast, ToastContainer } = useLandingToast();
  const { user, signOut } = useAuth();
  const [fane, setFane] = useState<Fane>("profil");
  const [slettBekreft, setSlettBekreft] = useState(false);
  const [datautlevering, setDatautlevering] = useState(false);

  const displayName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) || "Astrid Hansen";
  const displayEmail = user?.email ?? "astrid@example.com";

  const onNav = useCallback(
    (id: string) => {
      if (id === "logout") {
        void signOut().then(() => {
          void router.push("/");
        });
        return;
      }
      const paths: Record<string, string> = {
        hjem: "/",
        bestill: "/bestill",
        mine: "/mine",
        "chat-kunde": "/chat",
        "kunde-profil": "/profil",
      };
      void router.push(paths[id] ?? "/");
    },
    [router, signOut],
  );

  return (
    <div className="phone fu">
      <ToastContainer />
      <ProfilHeader title="Min profil" onBack={() => onNav("hjem")} backLabel="Hjem" centerTitle />

      {slettBekreft && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.5)", padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "24px",
              width: "100%",
              maxWidth: 360,
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <div style={{ fontSize: 30, textAlign: "center", marginBottom: 12 }} aria-hidden>
              ⚠️
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>Slett min konto</div>
            <div style={{ fontSize: 11, color: C.soft, textAlign: "center", lineHeight: 1.7, marginBottom: 14 }}>
              Dette vil anonymisere alle dine personopplysninger i samsvar med GDPR artikkel 17. Bestillingshistorikk beholdes i anonymisert form i 5 år (regnskapskrav).
            </div>
            <div
              style={{ background: C.dangerBg, borderRadius: 9, padding: "9px 12px", fontSize: 10, color: C.danger, lineHeight: 1.6, marginBottom: 16 }}
            >
              ⚠️ Handlingen kan ikke angres. Du mister all tilgang og historikk.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setSlettBekreft(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 9,
                  background: "white",
                  border: `1.5px solid ${C.border}`,
                  color: C.navy,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={() => {
                  toast("Sletting initiert — du mottar bekreftelse på e-post", "warn");
                  setSlettBekreft(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 9,
                  background: C.danger,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                Slett konto
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {datautlevering && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.5)", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px", width: "100%", maxWidth: 360 }}>
            <div style={{ fontSize: 30, textAlign: "center", marginBottom: 12 }} aria-hidden>
              📦
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>Last ned dine data</div>
            <div style={{ fontSize: 11, color: C.soft, textAlign: "center", lineHeight: 1.7, marginBottom: 20 }}>
              Vi sender deg en JSON-fil med alle data vi har om deg til din registrerte e-post innen 72 timer (GDPR art. 20).
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setDatautlevering(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  borderRadius: 9,
                  background: "white",
                  border: `1.5px solid ${C.border}`,
                  color: C.navy,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={() => {
                  toast("Dataeksport sendes til din e-post", "ok");
                  setDatautlevering(false);
                }}
                className="btn bp"
                style={{ flex: 1, padding: "10px 0", fontSize: 12, borderRadius: 9 }}
              >
                Send meg data
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      <div style={{ display: "flex", margin: "0 11px", marginTop: 10, background: C.greenXL, borderRadius: 9, padding: 3, flexShrink: 0 }}>
        {(
          [
            ["profil", "👤 Profil"],
            ["betaling", "💳 Betaling"],
            ["personvern", "🔒 Personvern"],
          ] as [Fane, string][]
        ).map(([k, l]) => (
          <button
            type="button"
            key={k}
            onClick={() => setFane(k)}
            style={{
              flex: 1,
              padding: "6px 4px",
              borderRadius: 7,
              fontSize: 10,
              fontWeight: fane === k ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: fane === k ? "white" : "transparent",
              color: fane === k ? C.green : C.soft,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="sa" style={{ padding: "12px 14px" }}>
        {fane === "profil" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px",
                background: "white",
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.green},${C.greenDark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {hentInitialer(displayName)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{displayName}</div>
                <div style={{ fontSize: 11, color: C.soft }}>{displayEmail}</div>
                <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>✓ Verifisert konto</div>
              </div>
              <button
                type="button"
                onClick={() => toast("Bilde-opplasting åpner kameraet")}
                style={{ fontSize: 10, color: C.green, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
              >
                Endre
              </button>
            </div>
            {[
              { l: "Fullt navn", v: displayName },
              { l: "E-post", v: displayEmail },
              { l: "Telefon", v: "415 22 334" },
              { l: "Adresse", v: "Konggata 12, 1500 Moss" },
            ].map((f) => (
              <div
                key={f.l}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${C.border}` }}
              >
                <div>
                  <div style={{ fontSize: 10, color: C.soft, marginBottom: 1 }}>{f.l}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{f.v}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toast(`${f.l} kan endres`)}
                  style={{ fontSize: 10, color: C.green, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                >
                  Endre
                </button>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Pårørende / annen mottaker</div>
              <div
                style={{
                  background: C.greenXL,
                  borderRadius: 10,
                  padding: "11px 13px",
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>Olaf Hansen</div>
                  <div style={{ fontSize: 10, color: C.soft }}>Far · Storgata 8, Moss</div>
                </div>
                <button
                  type="button"
                  onClick={() => toast("Rediger pårørende")}
                  style={{ fontSize: 10, color: C.green, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                >
                  Endre
                </button>
              </div>
              <button
                type="button"
                onClick={() => toast("Legg til pårørende")}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "9px 0",
                  fontSize: 11,
                  borderRadius: 9,
                  background: "white",
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Legg til pårørende
              </button>
            </div>
            <button
              type="button"
              onClick={() => onNav("logout")}
              className="btn"
              style={{
                width: "100%",
                marginTop: 20,
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
          </div>
        )}

        {fane === "betaling" && (
          <div>
            <div style={{ fontSize: 11, color: C.soft, marginBottom: 14, lineHeight: 1.6 }}>Betalingsmetoder brukt ved bestilling</div>
            {[
              { icon: "💜", label: "Vipps", detalj: "+47 415 22 334", standard: true },
              { icon: "💳", label: "Visa-kort", detalj: "•••• •••• •••• 4242", standard: false },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "13px 15px",
                  marginBottom: 10,
                  border: `1.5px solid ${b.standard ? C.green : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 24 }} aria-hidden>
                  {b.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{b.label}</div>
                  <div style={{ fontSize: 10, color: C.soft }}>{b.detalj}</div>
                </div>
                {b.standard && (
                  <span style={{ fontSize: 9, background: C.greenBg, color: C.green, padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>Standard</span>
                )}
                <button
                  type="button"
                  onClick={() => toast(b.standard ? "Allerede standard" : "Satt som standard", "ok")}
                  style={{ fontSize: 10, color: C.soft, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  ⋯
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => toast("Legg til betalingsmetode")}
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: 12,
                borderRadius: 10,
                background: C.greenBg,
                color: C.green,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              + Ny betalingsmetode
            </button>
          </div>
        )}

        {fane === "personvern" && (
          <div>
            <div
              style={{
                background: C.greenXL,
                borderRadius: 10,
                padding: "11px 13px",
                marginBottom: 16,
                fontSize: 10,
                color: C.navyMid,
                lineHeight: 1.65,
                border: `1px solid ${C.border}`,
              }}
            >
              🔒 EiraNova behandler dine persondata i henhold til GDPR. Du har full kontroll over dine data til enhver tid.
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Dine samtykker</div>
            {(
              [
                { label: "Behandling av helsedata", detalj: "Nødvendig for tjenesteleveranse", dato: "Godkjent 15. jan 2026", kan_trekkes: false },
                { label: "Vilkår for bruk", detalj: "Avbestillingsregler og ansvar", dato: "Godkjent 15. jan 2026", kan_trekkes: false },
                { label: "Markedsføring", detalj: "Tips og tilbud fra EiraNova", dato: "Godkjent 15. jan 2026", kan_trekkes: true },
              ] as const
            ).map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  borderRadius: 11,
                  padding: "11px 13px",
                  marginBottom: 8,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: C.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "white",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                  aria-hidden
                >
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.soft }}>
                    {s.detalj} · {s.dato}
                  </div>
                </div>
                {s.kan_trekkes && (
                  <button
                    type="button"
                    onClick={() => toast("Samtykke trukket — dette kan ikke angres", "warn")}
                    style={{ fontSize: 9, color: C.danger, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
                  >
                    Trekk
                  </button>
                )}
              </div>
            ))}

            <div style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 16 }}>Dine GDPR-rettigheter</div>
            {(
              [
                {
                  icon: "📦",
                  tittel: "Last ned mine data",
                  sub: "Alle data vi har om deg (art. 20)",
                  action: () => setDatautlevering(true),
                  color: C.sky,
                },
                {
                  icon: "🗑",
                  tittel: "Slett min konto",
                  sub: "Anonymisering av alle personopplysninger (art. 17)",
                  action: () => setSlettBekreft(true),
                  color: C.danger,
                },
                {
                  icon: "📧",
                  tittel: "Kontakt personvernombud",
                  sub: "lise@eiranova.no",
                  action: () => toast("E-post åpnes"),
                  color: C.green,
                },
              ] as const
            ).map((r) => (
              <div
                key={r.tittel}
                role="button"
                tabIndex={0}
                onClick={r.action}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    r.action();
                  }
                }}
                style={{
                  background: "white",
                  borderRadius: 11,
                  padding: "12px 14px",
                  marginBottom: 8,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = r.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${r.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.tittel}</div>
                  <div style={{ fontSize: 10, color: C.soft }}>{r.sub}</div>
                </div>
                <span style={{ color: C.soft, fontSize: 16 }} aria-hidden>
                  ›
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BNav active="kunde-profil" onNav={onNav} items={BN_ITEMS} />
      <DeskNav active="kunde-profil" onNav={onNav} items={BN_ITEMS} title="EiraNova" />
    </div>
  );
}
