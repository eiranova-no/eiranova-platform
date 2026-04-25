"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { C } from "../../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassordPage() {
  const router = useRouter();
  const { updatePassword, user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(!!session);
      setChecked(true);
    });
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (password.length < 8) {
        setError("Passord må ha minst 8 tegn.");
        return;
      }
      if (password !== password2) {
        setError("Passordene stemmer ikke overens.");
        return;
      }
      const res = await updatePassword(password);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.replace("/");
    },
    [password, password2, router, updatePassword],
  );

  if (!checked) {
    return (
      <div
        className="pw-app"
        style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Laster …
      </div>
    );
  }

  if (!hasRecoverySession && !user && !authLoading) {
    return (
      <div className="phone fu" style={{ background: "#FAF6F1", minHeight: "100dvh" }}>
        <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
          <p style={{ color: C.navy, fontSize: 14, lineHeight: 1.6 }}>
            Lenken er ugyldig eller utløpt. Gå til innlogging og bruk «Glemt passord?» for å få en ny
            e-post.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="btn bp"
            style={{ marginTop: 16, borderRadius: 11, width: "100%", padding: "12px 0" }}
          >
            Til innlogging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone fu" style={{ background: "#FAF6F1", minHeight: "100dvh" }}>
      <div
        style={{
          padding: "24px 20px 20px",
          background: `linear-gradient(160deg,${C.navy},${C.greenDark})`,
        }}
      >
        <div className="fr" style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 2 }}>
          Nytt passord
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Velg et trygt passord (min. 8 tegn)</div>
      </div>
      <form className="sa" style={{ padding: 24 }} onSubmit={onSubmit}>
        {error && (
          <div style={{ fontSize: 12, color: C.danger, marginBottom: 12 }}>{error}</div>
        )}
        <label
          style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}
        >
          Nytt passord
        </label>
        <input
          className="inp"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <label
          style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}
        >
          Bekreft passord
        </label>
        <input
          className="inp"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <button type="submit" className="btn bp bf" style={{ width: "100%", borderRadius: 11 }}>
          Lagre passord
        </button>
      </form>
    </div>
  );
}
