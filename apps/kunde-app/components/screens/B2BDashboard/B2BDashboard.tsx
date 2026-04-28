"use client";

import { B2B_COORD_BRUKERE } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useRouter } from "next/navigation";

const C = colors;

export function B2BDashboard() {
  const router = useRouter();
  const totalMnd = B2B_COORD_BRUKERE.filter((b) => b.aktiv).reduce((s, b) => s + b.mnd_pris, 0);

  return (
    <div className="phone fu">
      <div
        style={{
          padding: "14px 14px 18px",
          background: "linear-gradient(160deg,#1A2E24,#2C5C52)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div className="fr" style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
              Moss Kommune
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Koordinatorpanel · Rammeavtale</div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "#1A73E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "white",
            }}
          >
            MK
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            [`${B2B_COORD_BRUKERE.filter((b) => b.aktiv).length}`, "Aktive brukere"],
            [`${totalMnd.toLocaleString("nb-NO")} kr`, "Mnd. kostnad"],
            ["EHF", "Fakturering"],
          ].map(([v, l]) => (
            <div
              key={String(l)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,.12)",
                borderRadius: 9,
                padding: "7px 9px",
                textAlign: "center",
              }}
            >
              <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                {v}
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,.6)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sa" style={{ padding: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="fr" style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
            Dine brukere
          </div>
          <button
            type="button"
            onClick={() => router.push("/b2b/bestill")}
            className="btn bp"
            style={{ fontSize: 10, padding: "6px 12px" }}
          >
            + Legg til bruker
          </button>
        </div>

        {B2B_COORD_BRUKERE.map((b) => (
          <div
            key={b.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/b2b/bruker?id=${encodeURIComponent(b.id)}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/b2b/bruker?id=${encodeURIComponent(b.id)}`);
              }
            }}
            className="card"
            style={{ marginBottom: 8, cursor: "pointer", opacity: b.aktiv ? 1 : 0.55 }}
          >
            <div style={{ padding: "11px 13px", display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: b.aktiv ? C.greenDark : C.soft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {b.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{b.name}</span>
                  {!b.aktiv ? (
                    <span
                      style={{
                        fontSize: 8,
                        background: C.softBg,
                        color: C.soft,
                        padding: "1px 6px",
                        borderRadius: 50,
                      }}
                    >
                      Inaktiv
                    </span>
                  ) : null}
                  {!b.digitalt ? (
                    <span
                      style={{
                        fontSize: 8,
                        background: C.goldBg,
                        color: C.goldDark,
                        padding: "1px 6px",
                        borderRadius: 50,
                      }}
                    >
                      Koordinator bestiller
                    </span>
                  ) : null}
                </div>
                <div style={{ fontSize: 9, color: C.soft, marginBottom: 4 }}>
                  {b.adresse} · f. {b.dob}
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {b.ukeplan.slice(0, 3).map((u, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 8,
                        background: C.greenXL,
                        color: C.green,
                        padding: "1px 6px",
                        borderRadius: 4,
                        border: `0.5px solid ${C.border}`,
                      }}
                    >
                      {u.dag} {u.tjeneste.split(" ")[0]}
                    </span>
                  ))}
                  {b.ukeplan.length > 3 ? (
                    <span style={{ fontSize: 8, color: C.soft }}>+{b.ukeplan.length - 3}</span>
                  ) : null}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>
                  {b.mnd_pris.toLocaleString("nb-NO")} kr
                </div>
                <div style={{ fontSize: 8, color: C.soft }}>per mnd</div>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 6,
            background: C.greenXL,
            borderRadius: 12,
            padding: "12px 13px",
            border: `1px solid ${C.border}`,
          }}
        >
          <div className="fr" style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
            Hurtigbestilling
          </div>
          <div style={{ fontSize: 10, color: C.soft, marginBottom: 10 }}>
            Bestill ekstra tjeneste for en bruker nå
          </div>
          <button
            type="button"
            onClick={() => router.push("/b2b/bestill")}
            className="btn bp"
            style={{ width: "100%", padding: "9px 0", fontSize: 11, borderRadius: 9 }}
          >
            Bestill på vegne av bruker →
          </button>
        </div>
      </div>

      <nav className="bnav">
        {[
          { icon: "🏠", label: "Hjem" },
          { icon: "📋", label: "Oppdrag" },
          { icon: "🧾", label: "Faktura" },
          { icon: "👤", label: "Konto" },
        ].map((it, i) => (
          <button key={it.label} type="button" className="bi">
            <span style={{ fontSize: 20 }}>{it.icon}</span>
            <span style={{ fontSize: 9, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.green : C.soft }}>
              {it.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
