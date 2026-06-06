"use client";

import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent, type MouseEvent } from "react";

import { useAuth } from "@/lib/auth/useAuth";

const C = colors;

function klikkRegistrert(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("klikk registrert");
  }
}

export function Login() {
  const router = useRouter();
  const { signInMock } = useAuth();

  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");
  const [showPassordLogin, setShowPassordLogin] = useState(false);

  const goRolle = useCallback(() => {
    signInMock();
    router.push("/rolle");
  }, [router, signInMock]);

  const fullforNurseMock = () => {
    setFeil("");
    goRolle();
  };

  const loggInnMock = (e?: MouseEvent | FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (process.env.NODE_ENV === "development") console.log("nurse klikk");
    klikkRegistrert();
    const erIntern = (s: string) => s.trim().toLowerCase().endsWith("@eiranova.no");
    if (!erIntern(email)) {
      setFeil("Kun @eiranova.no-e-post er tillatt i mock-innlogging.");
      return;
    }
    if (!passord.trim()) {
      setFeil("Skriv inn passord.");
      return;
    }
    fullforNurseMock();
  };

  const eiraKontoKlikk = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (process.env.NODE_ENV === "development") console.log("nurse klikk");
    klikkRegistrert();
    fullforNurseMock();
  };

  const tilbakePrimær = () => {
    setShowPassordLogin(false);
    setFeil("");
  };

  const glemtPassordKlikk = () => {
    router.push("/glemt-passord");
  };

  return (
    <div className="phone nurse-login-shell">
      <div
        style={{
          padding: "30px 18px 28px",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>🩺</div>
        <div className="fr" style={{ fontSize: 21, fontWeight: 600, color: "white", marginBottom: 4 }}>
          Logg inn som ansatt
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)" }}>Kun for inviterte EiraNova-ansatte</div>
      </div>
      <div className="sa" style={{ padding: "22px 18px", position: "relative", zIndex: 1, isolation: "isolate", minHeight: 0 }}>
        <div className="login-stack" style={{ position: "relative", zIndex: 5, pointerEvents: "auto", isolation: "isolate" }}>
          {!showPassordLogin ? (
            <>
              <div
                style={{
                  position: "relative",
                  zIndex: 20,
                  isolation: "isolate",
                  flexShrink: 0,
                  width: "100%",
                  marginBottom: 10,
                }}
              >
                <button
                  type="button"
                  onClick={eiraKontoKlikk}
                  className="btn bp bf"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    isolation: "isolate",
                    flexShrink: 0,
                    width: "100%",
                    borderRadius: 11,
                    fontSize: 14,
                    padding: "16px 14px",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Logg inn med EiraNova-konto</span>
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.92 }}>
                    Bruker din @eiranova.no e-post
                  </span>
                </button>
              </div>
              <div style={{ position: "relative", zIndex: 10, isolation: "isolate", flexShrink: 0, width: "100%" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassordLogin(true);
                    setFeil("");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    margin: 0,
                    padding: "14px 12px",
                    minHeight: 48,
                    boxSizing: "border-box",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.green,
                    textAlign: "center",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    WebkitAppearance: "none",
                    appearance: "none",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  Kan ikke logge inn? Bruk e-post og passord →
                </button>
              </div>
              <p style={{ fontSize: 11, color: C.soft, textAlign: "center", lineHeight: 1.5, margin: "14px 0 0" }}>
                Kun{" "}
                <strong style={{ color: C.navyMid }}>@eiranova.no</strong>
                -kontoer har tilgang.
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={tilbakePrimær}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 11,
                  color: C.green,
                  fontWeight: 600,
                  padding: "0 0 14px",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                ← Tilbake til EiraNova-konto innlogging
              </button>
              <div
                style={{
                  background: C.greenXL,
                  borderRadius: 13,
                  padding: "14px 16px",
                  marginBottom: 12,
                  border: `1.5px solid ${C.greenBg}`,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.navy,
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    E-post
                  </label>
                  <input
                    className="inp"
                    type="email"
                    placeholder="fornavn@eiranova.no"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.navy,
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    Passord
                  </label>
                  <input
                    className="inp"
                    type="password"
                    placeholder="••••••••"
                    value={passord}
                    onChange={(e) => setPassord(e.target.value)}
                  />
                </div>
                <div style={{ textAlign: "right", marginBottom: 10 }}>
                  <button
                    type="button"
                    onClick={glemtPassordKlikk}
                    style={{
                      fontSize: 10,
                      color: C.green,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Glemt passord?
                  </button>
                </div>
                <p style={{ fontSize: 10, color: C.soft, lineHeight: 1.55, margin: 0 }}>
                  Problemer med innlogging? Kontakt din leder eller post@eiranova.no
                </p>
              </div>
              {feil ? (
                <div style={{ fontSize: 12, color: C.danger, marginBottom: 8 }}>{feil}</div>
              ) : null}
              <button
                type="button"
                onClick={loggInnMock}
                className="btn bp bf"
                style={{
                  borderRadius: 11,
                  marginBottom: 10,
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                Logg inn med e-post
              </button>
              <p style={{ fontSize: 12, color: C.soft, textAlign: "center", lineHeight: 1.5, margin: 0 }}>
                Kun <strong>@eiranova.no</strong>-kontoer skal ha tilgang i produksjon.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
