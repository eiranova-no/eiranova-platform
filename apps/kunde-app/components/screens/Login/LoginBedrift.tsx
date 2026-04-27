"use client";

import type { Dispatch, SetStateAction } from "react";

import { colors } from "@eiranova/ui";

const C = colors;

type BedriftSubMode = "har_tilgang" | "ingen_tilgang" | "bruker" | null;

export type LandingToastFn = (msg: string, type?: "ok" | "err" | "warn", dur?: number) => void;

export interface LoginBedriftProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  bedriftMode: BedriftSubMode;
  setBedriftMode: Dispatch<SetStateAction<BedriftSubMode>>;
  onBackType: () => void;
  toast: LandingToastFn;
}

export function LoginBedrift({
  email,
  setEmail,
  bedriftMode,
  setBedriftMode,
  onBackType,
  toast,
}: LoginBedriftProps) {
  const isKommune = email.includes(".kommune.no");

  return (
    <div className="phone fu">
      <div style={{ padding: "20px 18px 18px", background: "linear-gradient(160deg,#1A2E24,#2C5C52)", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => {
            onBackType();
            setBedriftMode(null);
          }}
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
          Bedriftskunde
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Kommune · Borettslag · Bedrift</div>
      </div>
      <div className="sa" style={{ padding: "14px 18px" }}>
        {!bedriftMode && (
          <>
            <div style={{ background: "#1A2E24", borderRadius: 12, padding: "14px 15px", marginBottom: 16, color: "white" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Slik får du tilgang</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(74,188,158,.25)",
                    border: "1px solid rgba(74,188,158,.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#4ABC9E",
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 7, flex: 1 }}>
                  <span style={{ fontSize: 14, lineHeight: 1.4 }}>🤝</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", lineHeight: 1.45, marginBottom: 6 }}>
                      Dere fyller ut kontaktskjema — vi ringer dere innen 1 virkedag
                    </div>
                    <button
                      type="button"
                      onClick={() => {}}
                      style={{
                        fontSize: 10,
                        color: "#4ABC9E",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      Gå til kontaktskjema <span aria-hidden>↓</span>
                    </button>
                  </div>
                </div>
              </div>
              {(
                [
                  { n: "2", t: "Admin registrerer deg som koordinator i systemet", i: "👤" },
                  { n: "3", t: "Du mottar en personlig invitasjon på jobb-e-post", i: "📧" },
                  { n: "4", t: "Klikk lenken og logg inn — tilgang er klar", i: "✅" },
                ] as const
              ).map((s) => (
                <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(74,188,158,.25)",
                      border: "1px solid rgba(74,188,158,.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#4ABC9E",
                      flexShrink: 0,
                    }}
                  >
                    {s.n}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
                    <span style={{ fontSize: 14 }}>{s.i}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.8)", lineHeight: 1.4 }}>{s.t}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="fr" style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
              Har du mottatt invitasjon?
            </div>

            {(
              [
                { key: "har_tilgang" as const, icon: "✅", title: "Ja, jeg har fått invitasjon", sub: "Logg inn med e-post eller Google Workspace", border: C.green, bg: C.greenBg },
                { key: "ingen_tilgang" as const, icon: "❓", title: "Nei, jeg har ikke fått invitasjon", sub: "Se hva du må gjøre for å få tilgang", border: C.border, bg: C.goldBg },
                { key: "bruker" as const, icon: "👴", title: "Jeg er bruker / pasient", sub: "Din koordinator har lagt deg til i systemet", border: C.border, bg: "#EDE9FE" },
              ] as const
            ).map((r) => (
              <div
                key={r.key}
                role="button"
                tabIndex={0}
                onClick={() => setBedriftMode(r.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setBedriftMode(r.key);
                }}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "13px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                  border: `2px solid ${r.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: r.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: C.soft }}>{r.sub}</div>
                </div>
                <span style={{ color: C.soft, fontSize: 18 }}>›</span>
              </div>
            ))}
          </>
        )}

        {bedriftMode === "har_tilgang" && (
          <>
            <button
              type="button"
              onClick={() => setBedriftMode(null)}
              style={{ background: "none", border: "none", color: C.green, fontSize: 11, cursor: "pointer", fontFamily: "inherit", marginBottom: 14, padding: 0 }}
            >
              ← Tilbake
            </button>
            <div
              style={{
                background: C.greenXL,
                borderRadius: 10,
                padding: "10px 13px",
                marginBottom: 14,
                border: `1px solid ${C.border}`,
                fontSize: 10,
                color: C.navyMid,
                lineHeight: 1.55,
              }}
            >
              <span style={{ fontWeight: 600, color: C.green }}>Kun for inviterte koordinatorer.</span> Har du ikke
              mottatt invitasjon, har du ikke tilgang ennå.
            </div>
            <button
              type="button"
              onClick={() => {}}
              style={{
                width: "100%",
                padding: "12px 0",
                background: "white",
                color: "#1F1F1F",
                border: "1.5px solid #DADCE0",
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                marginBottom: 10,
                fontFamily: "inherit",
                boxShadow: "0 1px 4px rgba(0,0,0,.08)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                />
              </svg>
              Logg inn med Google Workspace
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 10, color: C.soft }}>eller e-post</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>E-post</label>
              <input
                className="inp"
                type="email"
                placeholder="koordinator@moss.kommune.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {isKommune && <div style={{ fontSize: 9, color: C.green, marginTop: 3 }}>✓ Kommunekonto gjenkjent</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Passord</label>
              <input className="inp" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button type="button" onClick={() => {}} className="btn bf" style={{ borderRadius: 11, background: "#1A2E24", color: "white" }}>
              Logg inn som koordinator
            </button>
          </>
        )}

        {bedriftMode === "ingen_tilgang" && (
          <>
            <button
              type="button"
              onClick={() => setBedriftMode(null)}
              style={{ background: "none", border: "none", color: C.green, fontSize: 11, cursor: "pointer", fontFamily: "inherit", marginBottom: 14, padding: 0 }}
            >
              ← Tilbake
            </button>
            <div style={{ background: C.dangerBg, border: "1px solid rgba(225,29,72,.2)", borderRadius: 12, padding: "13px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.danger, marginBottom: 4 }}>Du har ikke tilgang ennå</div>
              <div style={{ fontSize: 10, color: C.navyMid, lineHeight: 1.6 }}>Koordinatortilgang kan ikke opprettes selv — den gis av EiraNova etter avtale med din organisasjon.</div>
            </div>
            <div className="fr" style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Slik får din organisasjon tilgang:</div>
            {(
              [
                { t: "Din leder/IT tar kontakt med EiraNova", i: "📞", btn: "Ring oss: 900 12 345", tel: "tel:90012345" },
                { t: "EiraNova registrerer din organisasjon som B2B-kunde", i: "📝", btn: null, tel: null },
                { t: "Du mottar personlig invitasjon på jobb-e-post", i: "📧", btn: null, tel: null },
              ] satisfies ReadonlyArray<{ t: string; i: string; btn: string | null; tel: string | null }>
            ).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: C.greenBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {s.i}
                  </div>
                  {i < 2 && <div style={{ width: 1.5, height: 16, background: C.border, marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < 2 ? 8 : 0 }}>
                  <div style={{ fontSize: 11, color: C.navy, lineHeight: 1.5, marginBottom: s.btn ? 6 : 0 }}>{s.t}</div>
                  {s.btn && (
                    <button
                      type="button"
                      onClick={() => {
                        if (s.tel) window.location.href = s.tel;
                        else if (s.btn) toast(s.btn, "ok");
                      }}
                      style={{
                        fontSize: 10,
                        padding: "5px 12px",
                        background: C.green,
                        color: "white",
                        border: "none",
                        borderRadius: 7,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {s.btn}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 13px", background: C.softBg, borderRadius: 9, fontSize: 10, color: C.soft, textAlign: "center", lineHeight: 1.6 }}>
              Er du pasient og ikke koordinator?{" "}
              <span onClick={() => setBedriftMode("bruker")} style={{ color: C.green, cursor: "pointer", fontWeight: 600 }}>
                Klikk her
              </span>
            </div>
          </>
        )}

        {bedriftMode === "bruker" && (
          <>
            <button
              type="button"
              onClick={() => setBedriftMode(null)}
              style={{ background: "none", border: "none", color: C.green, fontSize: 11, cursor: "pointer", fontFamily: "inherit", marginBottom: 14, padding: 0 }}
            >
              ← Tilbake
            </button>
            <div style={{ background: "#F5F3FF", border: "1px solid #C4B5FD", borderRadius: 10, padding: "11px 13px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6D28D9", marginBottom: 3 }}>Bruker / Pasient</div>
              <div style={{ fontSize: 10, color: "#5B21B6", lineHeight: 1.55 }}>Din koordinator har lagt deg til i EiraNova og sendt en invitasjons-e-post med aktiveringslenke.</div>
            </div>
            <button type="button" onClick={() => {}} className="btn bp bf" style={{ borderRadius: 11, marginBottom: 12 }}>
              Aktiver konto med invitasjon →
            </button>
            <div style={{ fontSize: 10, color: C.soft, marginBottom: 10, textAlign: "center" }}>Har du allerede aktivert? Logg inn under.</div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Din e-post</label>
              <input className="inp" type="email" placeholder="ola.nordmann@gmail.com" autoComplete="email" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Passord</label>
              <input className="inp" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button type="button" onClick={() => {}} className="btn bp bf" style={{ borderRadius: 11, marginBottom: 12 }}>
              Logg inn
            </button>
            <div style={{ textAlign: "center", fontSize: 10, color: C.soft, lineHeight: 1.6 }}>
              Ikke mottatt invitasjon?{" "}
              <span onClick={() => {}} style={{ color: C.green, cursor: "pointer", fontWeight: 600 }}>
                Les hva du gjør →
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
