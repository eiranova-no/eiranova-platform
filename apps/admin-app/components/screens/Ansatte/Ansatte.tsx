"use client";

import {
  B2B_ROLLER,
  INIT_B2B_TILGANGER,
  INIT_STAFF,
  INTERNE_ROLLER,
  ROLLE_INFO,
  ROLLE_TILGANGER,
} from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ModalPortal } from "@/components/admin/ModalPortal";
import { useAdminToast } from "@/components/admin/useAdminToast";

import { VikarPanel } from "./VikarPanel";

const C = colors;

type RolleKey = keyof typeof ROLLE_INFO;
type StaffRow = (typeof INIT_STAFF)[number];
type B2bTilgangRad = (typeof INIT_B2B_TILGANGER)[number] & { invitasjonsPending?: string[] };
type B2bKoordinator = B2bTilgangRad["koordinatorer"][number];

interface VentendeProfilendring {
  id: string;
  nurseName: string;
  sammendrag: string;
}

interface NyAnsattForm {
  name: string;
  email: string;
  role: string;
  scope: string;
}

type AnsatteTab = "interne" | "vikarer" | "b2b" | "roller";

export function Ansatte() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, ToastContainer } = useAdminToast();

  const [staff, setStaff] = useState<StaffRow[]>(() => [...INIT_STAFF]);
  const [b2bTilganger, setB2bTilganger] = useState<B2bTilgangRad[]>(() => INIT_B2B_TILGANGER.map((t) => ({ ...t })));
  const [ventendeProfilendringer, setVentendeProfilendringer] = useState<VentendeProfilendring[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [ws, setWs] = useState<Record<string, string | undefined>>({});
  const [form, setForm] = useState<NyAnsattForm>({ name: "", email: "", role: "sykepleier", scope: "intern" });
  const [del, setDel] = useState<StaffRow | null>(null);
  const [activeTab, setActiveTab] = useState<AnsatteTab>("interne");
  const [b2bModal, setB2bModal] = useState<B2bTilgangRad | null>(null);
  const [revisjonModal, setRevisjonModal] = useState<B2bKoordinator | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDomene, setInviteDomene] = useState("");

  const prefillEmail = searchParams.get("prefillEmail");
  useEffect(() => {
    if (!prefillEmail) return;
    setActiveTab("interne");
    setForm((f) => ({ ...f, name: "", email: prefillEmail, role: "koordinator", scope: "intern" }));
    setModal("ny");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("prefillEmail");
    router.replace(`/ansatte${params.toString() ? `?${params}` : ""}`);
  }, [prefillEmail, router, searchParams]);

  const sync = useCallback((id: string) => {
    setWs((s) => ({ ...s, [id]: "syncing" }));
    setTimeout(() => {
      setWs((s) => ({ ...s, [id]: "done" }));
      setTimeout(() => setWs((s) => ({ ...s, [id]: undefined })), 2500);
    }, 1400);
  }, []);

  const create = () => {
    if (!form.name || !form.email) return;
    const id = String(Date.now());
    setStaff((s) => [
      ...s,
      {
        id,
        name: form.name,
        email: form.email,
        role: form.role,
        scope: form.scope,
        googleWs: false,
        created: new Date().toISOString().split("T")[0],
      },
    ]);
    setModal(null);
    setForm({ name: "", email: "", role: "sykepleier", scope: "intern" });
    setWs((w) => ({ ...w, [id]: "syncing" }));
    setTimeout(() => {
      setStaff((s) => s.map((m) => (m.id === id ? { ...m, googleWs: true } : m)));
      setWs((w) => ({ ...w, [id]: "done" }));
      setTimeout(() => setWs((w) => ({ ...w, [id]: undefined })), 2500);
    }, 1600);
  };

  const remove = (m: StaffRow) => {
    setDel(null);
    setWs((w) => ({ ...w, [m.id]: "syncing" }));
    setTimeout(() => setStaff((s) => s.filter((x) => x.id !== m.id)), 1400);
  };

  const updateRole = (id: string, newRole: string) => {
    setStaff((s) => s.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    sync(id);
  };

  const ri = (r: string) => ROLLE_INFO[r as RolleKey] ?? { label: r, bg: C.softBg, c: C.soft, scope: "intern", desc: "" };

  const sendInvite = (tilgangId: string) => {
    if (!inviteEmail) return;
    setB2bTilganger((t) =>
      t.map((x) =>
        x.id === tilgangId ? { ...x, invitasjonsPending: [...(x.invitasjonsPending ?? []), inviteEmail] } : x,
      ),
    );
    setInviteEmail("");
    sync("inv_" + tilgangId);
  };

  const addDomene = (tilgangId: string) => {
    if (!inviteDomene) return;
    setB2bTilganger((t) =>
      t.map((x) => (x.id === tilgangId ? { ...x, hvitelisteDomener: [...x.hvitelisteDomener, inviteDomene] } : x)),
    );
    setInviteDomene("");
  };

  const removeKoord = (tilgangId: string, koordinatorId: string) => {
    setB2bTilganger((t) =>
      t.map((x) => (x.id === tilgangId ? { ...x, koordinatorer: x.koordinatorer.filter((k) => k.id !== koordinatorId) } : x)),
    );
  };

  const vCount = ventendeProfilendringer.length;
  const godkjenn = (id: string) => {
    setVentendeProfilendringer((p) => p.filter((x) => x.id !== id));
    toast("Profilendring godkjent — katalog oppdatert", "ok");
  };
  const avvis = (id: string) => {
    setVentendeProfilendringer((p) => p.filter((x) => x.id !== id));
    toast("Avvisningsmelding sendt til sykepleier (mock)", "info");
  };

  return (
    <div className="fu">
      <ToastContainer />
      <div
        style={{
          background: "linear-gradient(135deg,#F3FAF7,#E8F5F0)",
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: vCount ? 12 : 0, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Ventende profilendringer</div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: vCount ? C.goldBg : C.softBg,
              color: vCount ? C.goldDark : C.soft,
              padding: "3px 10px",
              borderRadius: 50,
              minWidth: 22,
              textAlign: "center",
            }}
          >
            {vCount}
          </span>
        </div>
        {vCount === 0 && <div style={{ fontSize: 11, color: C.soft }}>Ingen endringer venter på godkjenning.</div>}
        {ventendeProfilendringer.map((p) => (
          <div key={p.id} style={{ background: "white", borderRadius: 10, padding: "12px 14px", marginBottom: 10, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{p.nurseName}</div>
            <div style={{ fontSize: 11, color: C.navyMid, lineHeight: 1.5, marginBottom: 10 }}>{p.sammendrag}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => godkjenn(p.id)} className="btn bp" style={{ padding: "7px 16px", fontSize: 11, borderRadius: 8, fontWeight: 600 }}>
                Godkjenn
              </button>
              <button
                type="button"
                onClick={() => avvis(p.id)}
                style={{
                  padding: "7px 16px",
                  fontSize: 11,
                  borderRadius: 8,
                  fontWeight: 600,
                  background: "white",
                  color: C.danger,
                  border: `1.5px solid ${C.danger}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avvis
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: 10,
          padding: 3,
          marginBottom: 14,
          border: `1px solid ${C.border}`,
          width: "fit-content",
        }}
      >
        {(
          [
            ["interne", "👥 Interne ansatte"],
            ["vikarer", "🤝 Tilkallingsvikarer"],
            ["b2b", "🏢 B2B-tilganger"],
            ["roller", "🔑 Rollematrise"],
          ] as const
        ).map(([t, l]) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: activeTab === t ? 600 : 400,
              cursor: "pointer",
              border: "none",
              background: activeTab === t ? C.greenBg : "transparent",
              color: activeTab === t ? C.green : C.soft,
              fontFamily: "inherit",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {activeTab === "interne" && (
        <>
          <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F0F7FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 18 18">
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
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 2 }}>Google Workspace — @eiranova.no</div>
              <div style={{ fontSize: 10, color: C.soft, lineHeight: 1.5 }}>
                Interne ansatte opprettes i Supabase og Google Workspace i én operasjon. Konto aktiveres automatisk.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{staff.filter((s) => s.scope !== "ekstern").length} interne ansatte</span>
            <button type="button" onClick={() => setModal("ny")} className="btn bp" style={{ fontSize: 11, padding: "7px 14px" }}>
              + Ny ansatt
            </button>
          </div>
          <div className="card" style={{ marginBottom: 14 }}>
            {staff
              .filter((s) => s.scope !== "ekstern")
              .map((m, i, arr) => {
                const r = ri(m.role);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 13px",
                      borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: C.greenDark,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {m.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{m.name}</span>
                        <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 50, background: r.bg, color: r.c, fontWeight: 600 }}>{r.label}</span>
                        {m.googleWs ? (
                          <span style={{ fontSize: 9, color: "#16A34A" }}>✓ Workspace</span>
                        ) : (
                          <span style={{ fontSize: 9, color: C.goldDark }}>⚠ Ikke synkronisert</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: C.soft, fontFamily: "monospace" }}>{m.email}</div>
                    </div>
                    <select
                      value={m.role}
                      onChange={(e) => updateRole(m.id, e.target.value)}
                      style={{
                        fontSize: 10,
                        padding: "4px 6px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        color: C.navy,
                        background: "white",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {INTERNE_ROLLER.map((role) => (
                        <option key={role} value={role}>
                          {ri(role).label}
                        </option>
                      ))}
                    </select>
                    {ws[m.id] === "syncing" && (
                      <div style={{ fontSize: 9, color: C.soft, display: "flex", alignItems: "center", gap: 3 }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            border: `1.5px solid ${C.border}`,
                            borderTopColor: C.green,
                            borderRadius: "50%",
                            animation: "spin .7s linear infinite",
                          }}
                        />
                        Sync…
                      </div>
                    )}
                    {ws[m.id] === "done" && (
                      <span style={{ fontSize: 9, color: "#16A34A", fontWeight: 600 }}>✓ Synkronisert</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setDel(m)}
                      style={{
                        padding: "4px 9px",
                        fontSize: 9,
                        borderRadius: 6,
                        background: C.dangerBg,
                        color: C.danger,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Fjern
                    </button>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {activeTab === "vikarer" && <VikarPanel />}

      {activeTab === "b2b" && (
        <>
          <div style={{ background: "#FFF3E0", border: "1px solid #FFD0A0", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E65100", marginBottom: 6 }}>Sikkerhetsprosess — 4 lag</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                ["1", "Individuell invitasjon", "Kun spesifikk e-postadresse kan aktivere"],
                ["2", "Domene-whitelist", "Bekrefter organisasjonstilhørighet"],
                ["3", "Kontaktperson godkjenner", "B2B-kontakt bekrefter via e-post"],
                ["4", "Revisjonsspor", "Alt loggføres med dato og hvem som ga tilgang"],
              ].map(([n, t, d]) => (
                <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#E65100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#7A3A00" }}>{t}</span>
                    <span style={{ fontSize: 10, color: "#7A3A00" }}> — {d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {b2bTilganger.map((t) => (
            <div key={t.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{t.kundeName}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {t.hvitelisteDomener.map((d) => (
                        <span key={d} style={{ fontSize: 9, background: C.greenBg, color: C.green, padding: "2px 8px", borderRadius: 50, fontWeight: 600 }}>
                          ✓ @{d}
                        </span>
                      ))}
                      {t.hvitelisteDomener.length === 0 && (
                        <span style={{ fontSize: 9, color: C.soft, fontStyle: "italic" }}>Ingen hvitelistede domener</span>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setB2bModal(t)} className="btn bp" style={{ fontSize: 10, padding: "6px 12px" }}>
                    + Gi tilgang
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.softBg, borderRadius: 8, padding: "6px 10px" }}>
                  <span style={{ fontSize: 11 }}>👤</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{t.kontaktperson.name}</span>
                    <span style={{ fontSize: 9, color: C.soft }}> · {t.kontaktperson.email}</span>
                  </div>
                  {t.kontaktperson.godkjentAv ? (
                    <span style={{ fontSize: 9, color: "#16A34A", fontWeight: 600 }}>✓ Godkjenner tilganger</span>
                  ) : (
                    <span style={{ fontSize: 9, color: C.goldDark, fontWeight: 600 }}>⚠ Ikke bekreftet</span>
                  )}
                </div>
              </div>

              {t.koordinatorer.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: "7px 14px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: C.soft,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      background: C.greenXL,
                    }}
                  >
                    Aktive koordinatorer ({t.koordinatorer.length})
                  </div>
                  {t.koordinatorer.map((k, i) => (
                    <div key={k.id} style={{ padding: "10px 14px", borderBottom: i < t.koordinatorer.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#E65100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {k.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{k.name}</span>
                            {k.domeneOK ? (
                              <span style={{ fontSize: 8, background: C.greenBg, color: C.green, padding: "1px 6px", borderRadius: 50, fontWeight: 600 }}>
                                ✓ Domene
                              </span>
                            ) : (
                              <span style={{ fontSize: 8, background: C.goldBg, color: C.goldDark, padding: "1px 6px", borderRadius: 50 }}>Manuell e-post</span>
                            )}
                            {k.godkjentAvKontakt ? (
                              <span style={{ fontSize: 8, background: C.greenBg, color: C.green, padding: "1px 6px", borderRadius: 50, fontWeight: 600 }}>
                                ✓ Godkjent
                              </span>
                            ) : (
                              <span style={{ fontSize: 8, background: C.dangerBg, color: C.danger, padding: "1px 6px", borderRadius: 50 }}>Ikke godkjent</span>
                            )}
                          </div>
                          <div style={{ fontSize: 9, color: C.soft, fontFamily: "monospace", marginBottom: 2 }}>{k.email}</div>
                          <div style={{ fontSize: 9, color: C.soft }}>
                            Gitt av {k.gittTilgangAv} · {k.godkjentDato}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRevisjonModal(k)}
                          style={{
                            fontSize: 9,
                            padding: "4px 9px",
                            background: C.softBg,
                            color: C.navyMid,
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Revisjon
                        </button>
                        <button
                          type="button"
                          onClick={() => removeKoord(t.id, k.id)}
                          style={{
                            fontSize: 9,
                            padding: "4px 9px",
                            background: C.dangerBg,
                            color: C.danger,
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Fjern
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {t.pending.length > 0 && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  <div
                    style={{
                      padding: "7px 14px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: C.goldDark,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      background: C.goldBg,
                    }}
                  >
                    Under behandling ({t.pending.length})
                  </div>
                  {t.pending.map((p, i) => {
                    const STEG_INFO: Record<string, { label: string; color: string; pct: number }> = {
                      invitert: { label: "Steg 1 av 3 — Invitasjon sendt", color: C.sky, pct: 33 },
                      venter_kontaktgodkjenning: {
                        label: "Steg 2 av 3 — Venter på godkjenning fra " + t.kontaktperson.name,
                        color: C.gold,
                        pct: 66,
                      },
                      venter_aktivering: { label: "Steg 3 av 3 — Venter på at bruker aktiverer konto", color: "#7C3AED", pct: 90 },
                    };
                    const s = STEG_INFO[p.steg] ?? { label: p.steg, color: C.soft, pct: 0 };
                    return (
                      <div key={p.id} style={{ padding: "10px 14px", borderBottom: i < t.pending.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: C.goldBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              flexShrink: 0,
                            }}
                          >
                            ⏳
                          </div>
                          <div style={{ flex: 1, minWidth: 100 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, fontFamily: "monospace", marginBottom: 1 }}>{p.email}</div>
                            <div style={{ fontSize: 9, color: C.soft }}>
                              Sendt {p.invitasjonsDate} av {p.gittTilgangAv}
                            </div>
                          </div>
                          <button
                            type="button"
                            style={{
                              fontSize: 9,
                              padding: "3px 8px",
                              background: "white",
                              border: `1px solid ${C.border}`,
                              borderRadius: 5,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              color: C.soft,
                            }}
                          >
                            Avbryt
                          </button>
                        </div>
                        <div style={{ background: C.softBg, borderRadius: 7, padding: "7px 10px" }}>
                          <div style={{ fontSize: 9, color: C.navyMid, marginBottom: 5, fontWeight: 500 }}>{s.label}</div>
                          <div style={{ height: 5, borderRadius: 50, background: C.border, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 50, background: s.color, width: `${s.pct}%`, transition: "width .4s" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            {["Invitert", "Godkjent", "Aktivert"].map((label, si) => (
                              <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <div
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: s.pct > si * 33 + 10 ? "#16A34A" : C.border,
                                  }}
                                />
                                <span style={{ fontSize: 8, color: C.soft }}>{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {t.koordinatorer.length === 0 && t.pending.length === 0 && (
                <div style={{ padding: 14, textAlign: "center", color: C.soft, fontSize: 11 }}>Ingen koordinatorer ennå — klikk &quot;+ Gi tilgang&quot;</div>
              )}
            </div>
          ))}
        </>
      )}

      {activeTab === "roller" && (
        <div className="card">
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
            <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
              Rollematrise
            </div>
            <div style={{ fontSize: 10, color: C.soft }}>Oversikt over hva hver rolle har tilgang til</div>
          </div>
          <div style={{ padding: "10px 14px 4px", fontSize: 9, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Interne roller — @eiranova.no
          </div>
          {INTERNE_ROLLER.map((r) => {
            const info = ri(r);
            return (
              <div key={r} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, padding: "2px 9px", borderRadius: 50, background: info.bg, color: info.c, fontWeight: 600 }}>{info.label}</span>
                  <span style={{ fontSize: 10, color: C.soft }}>{info.desc}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(ROLLE_TILGANGER[r as RolleKey] || []).map((perm) => (
                    <span
                      key={perm}
                      style={{ fontSize: 9, background: C.greenXL, color: C.green, padding: "2px 7px", borderRadius: 4, border: `0.5px solid ${C.border}` }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ padding: "10px 14px 4px", fontSize: 9, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: 0.8 }}>
            B2B-roller — eksternt domene
          </div>
          {B2B_ROLLER.map((r) => {
            const info = ri(r);
            return (
              <div key={r} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, padding: "2px 9px", borderRadius: 50, background: info.bg, color: info.c, fontWeight: 600 }}>{info.label}</span>
                  <span style={{ fontSize: 10, color: C.soft }}>{info.desc}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(ROLLE_TILGANGER[r as RolleKey] || []).map((perm) => (
                    <span
                      key={perm}
                      style={{
                        fontSize: 9,
                        background: "#FFF3E0",
                        color: "#E65100",
                        padding: "2px 7px",
                        borderRadius: 4,
                        border: "0.5px solid #FFD0A0",
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ padding: "10px 14px", fontSize: 9, color: C.soft, lineHeight: 1.6 }}>
            Roller settes i Supabase JWT-token ved innlogging. B2B-koordinatorer autentiseres via eget domene — EiraNova oppretter ikke Workspace-konto for dem.
          </div>
        </div>
      )}

      {modal === "ny" && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 22, width: "100%", maxWidth: 420, boxShadow: "0 8px 40px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
                Ny intern ansatt
              </span>
              <button type="button" onClick={() => setModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.soft }}>
                ✕
              </button>
            </div>
            {(
              [
                ["Fullt navn", "Ola Nordmann", "name", "text"],
                ["E-post (@eiranova.no)", "ola@eiranova.no", "email", "email"],
              ] as const
            ).map(([label, ph, key, type]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>{label}</label>
                <input
                  className="inp"
                  type={type}
                  placeholder={ph}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 3 }}>Rolle</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "9px 11px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 12,
                  outline: "none",
                  background: C.greenXL,
                  fontFamily: "inherit",
                  color: C.navy,
                }}
              >
                {INTERNE_ROLLER.map((r) => (
                  <option key={r} value={r}>
                    {ri(r).label} — {ri(r).desc}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ background: C.greenXL, borderRadius: 9, padding: "9px 12px", marginBottom: 14, fontSize: 10, color: C.navyMid, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: C.green, marginBottom: 3 }}>Skjer automatisk:</div>
              <div>
                ✓ Supabase-bruker med rolle: <strong>{form.role}</strong>
              </div>
              <div>✓ Google Workspace @eiranova.no opprettes</div>
              <div>✓ Midlertidig passord sendes på e-post</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setModal(null)}
                style={{
                  flex: 1,
                  padding: 11,
                  background: C.softBg,
                  color: C.soft,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button type="button" onClick={create} className="btn bp" style={{ flex: 2, padding: 11, borderRadius: 10, fontSize: 12 }}>
                Opprett + Workspace
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {b2bModal && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.5)", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 18, padding: "20px 18px 30px", width: "100%", maxWidth: 500, maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
                  Gi B2B-tilgang
                </div>
                <div style={{ fontSize: 10, color: C.soft }}>{b2bModal.kundeName}</div>
              </div>
              <button type="button" onClick={() => setB2bModal(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.soft }}>
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 18, position: "relative" }}>
              <div style={{ position: "absolute", top: 14, left: "10%", right: "10%", height: 2, background: C.border, zIndex: 0 }} />
              {(
                [
                  ["1", "Inviter", "📧"],
                  ["2", "Domene", "🔒"],
                  ["3", "Godkjenning", "✅"],
                  ["4", "Aktivering", "🎉"],
                ] as const
              ).map(([n, l, icon], i) => (
                <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: i === 0 ? C.green : C.softBg,
                      border: `2px solid ${i === 0 ? C.green : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: i === 0 ? "white" : C.soft,
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ fontSize: 8, color: i === 0 ? C.green : C.soft, textAlign: "center", fontWeight: i === 0 ? 600 : 400 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#F0FFF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "12px 13px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>Steg 1 — Inviter koordinator</div>
              <div style={{ fontSize: 9, color: "#166534", marginBottom: 10, lineHeight: 1.5 }}>
                Kun denne spesifikke e-postadressen kan aktivere kontoen. Invitasjonen er personlig og utløper etter 7 dager.
              </div>
              <label style={{ fontSize: 10, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>E-postadresse til koordinator</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  className="inp"
                  placeholder={"koordinator@" + b2bModal.kundeName.toLowerCase().replace(/ /g, "") + ".no"}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => sendInvite(b2bModal.id)} className="btn bp" style={{ padding: "8px 14px", fontSize: 11, flexShrink: 0 }}>
                  Send
                </button>
              </div>
            </div>

            <div style={{ background: C.softBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 13px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 2 }}>Steg 2 — Hvitelist domene (valgfritt)</div>
              <div style={{ fontSize: 9, color: C.soft, marginBottom: 10, lineHeight: 1.5 }}>
                Bekrefter at e-postadressen tilhører riktig organisasjon. Domenet alene gir <strong>ikke</strong> tilgang — individuell invitasjon kreves
                alltid.
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {b2bModal.hvitelisteDomener.map((d) => (
                  <span key={d} style={{ fontSize: 9, background: C.greenBg, color: C.green, padding: "3px 9px", borderRadius: 50, fontWeight: 600 }}>
                    ✓ @{d}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  className="inp"
                  placeholder="moss.kommune.no"
                  value={inviteDomene}
                  onChange={(e) => setInviteDomene(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => addDomene(b2bModal.id)} className="btn" style={{ padding: "8px 12px", fontSize: 11, background: C.greenBg, color: C.green, flexShrink: 0 }}>
                  Legg til
                </button>
              </div>
            </div>

            <div style={{ background: "#EFF6FF", border: "1px solid #BAD7FB", borderRadius: 10, padding: "12px 13px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.sky, marginBottom: 2 }}>Steg 3 — Kontaktperson godkjenner</div>
              <div style={{ fontSize: 9, color: "#1D4ED8", marginBottom: 8, lineHeight: 1.5 }}>
                Når du sender invitasjonen, mottar {b2bModal.kontaktperson.name} ({b2bModal.kontaktperson.email}) automatisk en e-post:{" "}
                <em>&quot;Godkjenner du at [navn] får koordinatortilgang?&quot;</em>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "white", borderRadius: 7, padding: "7px 10px" }}>
                <span style={{ fontSize: 14 }}>👤</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{b2bModal.kontaktperson.name}</div>
                  <div style={{ fontSize: 9, color: C.soft, fontFamily: "monospace" }}>{b2bModal.kontaktperson.email}</div>
                </div>
                {b2bModal.kontaktperson.godkjentAv ? (
                  <span style={{ fontSize: 9, color: "#16A34A", fontWeight: 600 }}>✓ Bekreftet kontaktperson</span>
                ) : (
                  <span style={{ fontSize: 9, color: C.goldDark }}>⚠ Ikke bekreftet ennå</span>
                )}
              </div>
            </div>

            <div style={{ background: "#F5F3FF", border: "1px solid #C4B5FD", borderRadius: 10, padding: "12px 13px", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6D28D9", marginBottom: 2 }}>Steg 4 — Bruker aktiverer konto</div>
              <div style={{ fontSize: 9, color: "#5B21B6", lineHeight: 1.55 }}>
                Koordinatoren klikker lenken i invitasjonse-posten og setter passord (eller logger inn med Google Workspace). Tilgangen aktiveres automatisk —
                ingen manuell handling fra EiraNova.
              </div>
            </div>

            <button type="button" onClick={() => setB2bModal(null)} className="btn bp bf" style={{ borderRadius: 11 }}>
              Lukk
            </button>
          </div>
        </ModalPortal>
      )}

      {revisjonModal && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 20, width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
                  Revisjonsspor
                </div>
                <div style={{ fontSize: 10, color: C.soft }}>{revisjonModal.name}</div>
              </div>
              <button type="button" onClick={() => setRevisjonModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.soft }}>
                ✕
              </button>
            </div>
            <div style={{ background: C.softBg, borderRadius: 9, padding: "4px 0", marginBottom: 14 }}>
              {(revisjonModal.revisjon || []).map((r, i, arr) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 10, padding: "9px 12px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, flexShrink: 0, marginTop: 3 }} />
                    {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: C.border, marginTop: 2 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 6 : 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{r.handling}</div>
                    <div style={{ fontSize: 9, color: C.soft }}>
                      {r.dato} · Av: {r.av}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: C.soft, lineHeight: 1.5, marginBottom: 12 }}>
              Dette revisjonslogg lagres i Supabase og kan ikke slettes. GDPR-dokumentasjon for tilgangsstyring.
            </div>
            <button type="button" onClick={() => setRevisjonModal(null)} className="btn bp bf" style={{ borderRadius: 10 }}>
              Lukk
            </button>
          </div>
        </ModalPortal>
      )}

      {del && (
        <ModalPortal overlayStyle={{ background: "rgba(0,0,0,.45)", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 22, width: "100%", maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize: 30, textAlign: "center", marginBottom: 10 }}>⚠️</div>
            <div className="fr" style={{ fontSize: 15, fontWeight: 600, color: C.navy, textAlign: "center", marginBottom: 7 }}>
              Fjern ansatt?
            </div>
            <div style={{ fontSize: 11, color: C.soft, textAlign: "center", lineHeight: 1.6, marginBottom: 14 }}>
              <strong>{del.name}</strong> fjernes fra Supabase og Google Workspace @eiranova.no.
            </div>
            <div style={{ background: C.dangerBg, borderRadius: 9, padding: "9px 12px", marginBottom: 14, fontSize: 10, color: C.danger, lineHeight: 1.7 }}>
              <div>✗ Mister tilgang umiddelbart</div>
              <div>✗ @eiranova.no Workspace-konto slettes</div>
              <div>✗ Aktive oppdrag må overføres manuelt</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setDel(null)}
                style={{
                  flex: 1,
                  padding: 11,
                  background: C.softBg,
                  color: C.soft,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={() => remove(del)}
                style={{
                  flex: 1,
                  padding: 11,
                  background: C.danger,
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Ja, fjern
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
