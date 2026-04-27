"use client";

import type { KundeFacingService } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { ProfilHeader } from "../KundeProfil/KundeProfil";

const C = colors;

export interface BestillSteg2DatoTidProps {
  tjeneste: KundeFacingService;
  dato: string;
  tidspunkt: string;
  adresse: string;
  onChangeDato: (d: string) => void;
  onChangeTid: (t: string) => void;
  onChangeAdresse: (a: string) => void;
  onBack: () => void;
  onNext: () => void;
  /** True når tjeneste kom fra URL (Hjem) — da er tilbake = Hjem, ikke tjenesteliste. */
  tjenestePreutfylt: boolean;
}

const DATO_VALG = ["Man 3. mars", "Tirs 4. mars", "Ons 5. mars", "Tors 6. mars"] as const;
const TID_VALG = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] as const;

/**
 * Steg 2/3: dato, tid, adresse (prototype Bestill steg 1).
 */
export function BestillSteg2DatoTid({
  tjeneste: sel,
  dato: date,
  tidspunkt: time,
  adresse,
  onChangeDato: setDate,
  onChangeTid: setTime,
  onChangeAdresse: setAdresse,
  onBack,
  onNext,
  tjenestePreutfylt,
}: BestillSteg2DatoTidProps) {
  return (
    <div className="phone fu">
      <ProfilHeader
        title="Dato og tid"
        onBack={onBack}
        backLabel={tjenestePreutfylt ? "Hjem" : "Velg tjeneste"}
        centerTitle
      />
      <div className="sa" style={{ padding: 13 }}>
        <div className="card cp" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: sel?.cat === "barsel" ? C.goldBg : C.greenBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {sel?.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: C.soft,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Valgt tjeneste
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{sel?.name}</div>
            {sel?.tagline ? (
              <div style={{ fontSize: 11, color: C.soft, fontStyle: "italic", lineHeight: 1.4, marginTop: 3 }}>{sel.tagline}</div>
            ) : null}
            <div style={{ fontSize: 12, color: C.soft }}>
              fra {sel?.price} kr · {sel?.duration} min
            </div>
          </div>
        </div>
        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 7 }}>Velg dato</div>
          {DATO_VALG.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDate(d)}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 11px",
                marginBottom: 5,
                borderRadius: 8,
                border: `1.5px solid ${date === d ? C.green : C.border}`,
                background: date === d ? C.greenBg : "white",
                fontSize: 12,
                color: date === d ? C.greenDark : C.navy,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: date === d ? 600 : 400,
                fontFamily: "inherit",
              }}
            >
              {d} {date === d && "✓"}
            </button>
          ))}
        </div>
        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 7 }}>Velg tidspunkt</div>
          <div className="g4" style={{ gap: 6 }}>
            {TID_VALG.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                style={{
                  padding: "8px 0",
                  border: `1.5px solid ${time === t ? C.green : C.border}`,
                  borderRadius: 7,
                  fontSize: 11,
                  fontWeight: time === t ? 600 : 400,
                  cursor: "pointer",
                  background: time === t ? C.greenBg : "white",
                  color: time === t ? C.greenDark : C.navy,
                  fontFamily: "inherit",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="card cp" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.navy, marginBottom: 5 }}>Adresse</div>
          <input
            className="inp"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            style={{ borderColor: C.green }}
          />
          <div style={{ fontSize: 9, color: C.green, marginTop: 3 }}>✓ Innenfor dekningsområde</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, justifyContent: "center" }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: s <= 1 ? C.green : C.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  style={{
                    width: 20,
                    height: 2,
                    background: s < 1 ? C.green : C.border,
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={onNext} className="btn bp bf" style={{ borderRadius: 11 }}>
          Velg sykepleier →
        </button>
      </div>
    </div>
  );
}
