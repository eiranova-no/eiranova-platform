"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { colors, hasFullNameTwoWords, isValidEmail } from "@eiranova/ui";

import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

import { useLandingToast } from "../Landing/useLandingToast";

import { LoginBedrift } from "./LoginBedrift";

const C = colors;

function klikkRegistrert(): void {
  if (process.env.NODE_ENV === "development") console.log("klikk registrert");
}

type LoginType = "privat" | "bedrift" | null;
type BedriftSubMode = "har_tilgang" | "ingen_tilgang" | "bruker" | null;
type KundeMode = "login" | "register";

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gate = searchParams.get("gate");
  const returUrl = searchParams.get("returUrl");
  const { signIn, signUp, user, loading } = useAuth();
  const { toast, ToastContainer } = useLandingToast();

  const [type, setType] = useState<LoginType>(null);
  const [bedriftMode, setBedriftMode] = useState<BedriftSubMode>(null);
  const [mode, setMode] = useState<KundeMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fulltNavn, setFulltNavn] = useState("");
  const [kundeLoginFeil, setKundeLoginFeil] = useState("");
  const [regFeil, setRegFeil] = useState({ fn: "", ep: "", pw: "" });
  const [regTrengerBekreftelse, setRegTrengerBekreftelse] = useState(false);

  const onAfterSignIn = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data: u } = await supabase
      .from("users")
      .select("address")
      .eq("id", session.user.id)
      .single();
    const postAuthPath =
      (gate && gate.startsWith("/") && !gate.startsWith("/login") ? gate : null) ??
      (returUrl && returUrl.startsWith("/") && !returUrl.startsWith("/login") ? returUrl : null);
    if (u?.address) {
      if (postAuthPath) {
        router.replace(postAuthPath);
        return;
      }
      router.replace("/");
    } else {
      router.replace("/onboarding/samtykke");
    }
  }, [gate, returUrl, router]);

  useEffect(() => {
    if (!loading && user) {
      void router.replace("/");
    }
  }, [user, loading, router]);

  const handlePrivatSignIn = useCallback(async () => {
    klikkRegistrert();
    if (!email.trim() || !password.trim()) {
      setKundeLoginFeil("Skriv inn e-post og passord.");
      return;
    }
    setKundeLoginFeil("");
    const r = await signIn(email.trim(), password);
    if (r?.error) {
      setKundeLoginFeil("E-post eller passord stemmer ikke.");
      return;
    }
    await onAfterSignIn();
  }, [email, password, onAfterSignIn, signIn]);

  const handleRegister = useCallback(async () => {
    const err = { fn: "", ep: "", pw: "" };
    if (!hasFullNameTwoWords(fulltNavn)) {
      err.fn = "Skriv fullt navn (minst to ord: fornavn og etternavn).";
    }
    if (!isValidEmail(email)) err.ep = "Ugyldig e-postformat.";
    if (String(password).length < 8) err.pw = "Passord må ha minst 8 tegn.";
    if (err.fn || err.ep || err.pw) {
      setRegFeil(err);
      return;
    }
    setRegFeil({ fn: "", ep: "", pw: "" });
    setRegTrengerBekreftelse(false);
    const r = await signUp(String(email).trim(), password, fulltNavn);
    if (r?.error) {
      setRegFeil({ fn: "", ep: r.error, pw: "" });
      return;
    }
    if (r?.needsEmailConfirmation) {
      setRegTrengerBekreftelse(true);
      return;
    }
    void router.push("/onboarding/push");
  }, [email, fulltNavn, password, router, signUp]);

  /** Matcher tidligere LoginGate: kun glemt-passord navigerer; landing/B2B er no-op. */
  const onNavKunde = useCallback((s: string) => {
    if (s === "glemt-passord") {
      void router.push("/glemt-passord");
    }
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, system-ui, sans-serif",
        }}
      >
        Laster …
      </div>
    );
  }
  if (user) {
    return null;
  }

  if (!type) {
    return (
      <>
        <ToastContainer />
        <div className="phone fu">
          <div
            style={{
              padding: "32px 18px 28px",
              background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
              textAlign: "center",
            }}
          >
            <div className="fr" style={{ fontSize: 22, fontWeight: 600, color: "white", marginBottom: 4 }}>
              Eira<span style={{ color: "#E8C4A4" }}>Nova</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontStyle: "italic" }}>Faglig trygghet. Menneskelig nærhet.</div>
          </div>
          <div className="sa" style={{ padding: "24px 18px" }}>
            <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 5, textAlign: "center" }}>
              Hvem er du?
            </div>
            <div style={{ fontSize: 11, color: C.soft, textAlign: "center", marginBottom: 22, lineHeight: 1.5 }}>Velg riktig innlogging for din konto</div>
            {(
              [
                { key: "privat" as const, icon: "👤", title: "Privat kunde", sub: "Bestill omsorg for deg selv eller pårørende. Betaler selv.", bg: C.greenBg },
                { key: "bedrift" as const, icon: "🏢", title: "Bedriftskunde", sub: "Kommune, borettslag eller bedrift. Faktura til organisasjonen.", bg: "#EEF2FF" },
              ] as const
            ).map((r) => (
              <div
                key={r.key}
                role="button"
                tabIndex={0}
                onClick={() => setType(r.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setType(r.key);
                }}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "15px 16px",
                  marginBottom: 10,
                  cursor: "pointer",
                  border: `2px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: r.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.5 }}>{r.sub}</div>
                </div>
                <span style={{ color: C.soft, fontSize: 18 }}>›</span>
              </div>
            ))}
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <span style={{ fontSize: 10, color: C.soft }}>Ikke mottatt invitasjon? </span>
              <span
                role="link"
                tabIndex={0}
                onClick={() => onNavKunde("ingen-invitasjon")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onNavKunde("ingen-invitasjon");
                }}
                style={{ fontSize: 10, color: C.green, cursor: "pointer", fontWeight: 600 }}
              >
                Les hva du gjør →
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (type === "privat") {
    return (
      <>
        <ToastContainer />
        <div className="phone fu">
          <div style={{ padding: "20px 18px 18px", background: `linear-gradient(160deg,${C.navy},${C.greenDark})` }}>
            <button
              type="button"
              onClick={() => setType(null)}
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
            <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 2 }}>Privat kunde</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Logg inn eller opprett konto</div>
          </div>
          <div className="sa" style={{ padding: "14px 18px" }}>
            <div className="login-stack">
              <button
                type="button"
                disabled
                title="Kommer når EiraNova AS er registrert"
                style={{
                  width: "100%",
                  minHeight: 48,
                  padding: "12px 0",
                  background: C.vipps,
                  color: "white",
                  border: "none",
                  borderRadius: 11,
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: 0.55,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  fontFamily: "inherit",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden>💜</span> Fortsett med Vipps
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 10, color: C.soft }}>eller</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              {regTrengerBekreftelse && (
                <div
                  style={{
                    background: C.greenXL,
                    borderRadius: 12,
                    padding: "12px 14px",
                    marginBottom: 14,
                    fontSize: 12,
                    color: C.navyMid,
                    lineHeight: 1.6,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  Vi har sendt en bekreftelseslenke til <strong style={{ color: C.navy }}>{String(email).trim()}</strong>. Åpne
                  lenken, deretter kan du logge inn. Sjekk spam-mappen hvis du ikke finner e-posten.
                </div>
              )}
              {mode === "register" && (
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Fullt navn</label>
                  <input
                    className="inp"
                    placeholder="Ola Nordmann"
                    value={fulltNavn}
                    onChange={(e) => {
                      setFulltNavn(e.target.value);
                      if (regFeil.fn) setRegFeil((r) => ({ ...r, fn: "" }));
                    }}
                  />
                  {regFeil.fn && <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{regFeil.fn}</div>}
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>E-post</label>
                <input
                  className="inp"
                  type="email"
                  placeholder="ola@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (regFeil.ep) setRegFeil((r) => ({ ...r, ep: "" }));
                  }}
                  autoComplete="email"
                />
                {mode === "register" && regFeil.ep && <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{regFeil.ep}</div>}
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Passord</label>
                <input
                  className="inp"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (regFeil.pw) setRegFeil((r) => ({ ...r, pw: "" }));
                  }}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                />
                {mode === "register" && regFeil.pw && <div style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{regFeil.pw}</div>}
              </div>
              {mode === "login" && (
                <>
                  {kundeLoginFeil && <div style={{ fontSize: 11, color: C.danger, marginBottom: 8 }}>{kundeLoginFeil}</div>}
                  <button
                    type="button"
                    onClick={() => {
                      void handlePrivatSignIn();
                    }}
                    className="btn bp bf"
                    style={{ borderRadius: 11 }}
                  >
                    Logg inn
                  </button>
                </>
              )}
              {mode === "register" && (
                <button
                  type="button"
                  onClick={() => {
                    void handleRegister();
                  }}
                  className="btn bp bf"
                  style={{ borderRadius: 11 }}
                >
                  Opprett konto
                </button>
              )}
              {mode === "login" && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={() => onNavKunde("glemt-passord")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onNavKunde("glemt-passord");
                    }}
                    style={{ fontSize: 11, color: C.green, cursor: "pointer", fontWeight: 600 }}
                  >
                    Glemt passord?
                  </span>
                </div>
              )}
              {mode === "login" && (
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <span style={{ fontSize: 10, color: C.soft }}>Ny bruker? </span>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={() => {
                      setMode("register");
                      setRegFeil({ fn: "", ep: "", pw: "" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setMode("register");
                        setRegFeil({ fn: "", ep: "", pw: "" });
                      }
                    }}
                    style={{ fontSize: 10, color: C.green, cursor: "pointer", fontWeight: 600 }}
                  >
                    Registrer deg
                  </span>
                </div>
              )}
              {mode === "register" && (
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <span style={{ fontSize: 10, color: C.soft }}>Har du allerede konto? </span>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={() => {
                      setMode("login");
                      setRegFeil({ fn: "", ep: "", pw: "" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setMode("login");
                        setRegFeil({ fn: "", ep: "", pw: "" });
                      }
                    }}
                    style={{ fontSize: 10, color: C.green, cursor: "pointer", fontWeight: 600 }}
                  >
                    Logg inn
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <LoginBedrift
        email={email}
        setEmail={setEmail}
        bedriftMode={bedriftMode}
        setBedriftMode={setBedriftMode}
        onBackType={() => setType(null)}
        toast={toast}
      />
    </>
  );
}
