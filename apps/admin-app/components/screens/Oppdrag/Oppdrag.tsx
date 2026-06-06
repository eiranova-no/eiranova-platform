"use client";

import { KANSELLERING_REGLER, NURSES, OPPDRAG, ORDERS, type MockOrder, type OppdragEndring } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";
import { useState } from "react";

import { Bdg } from "@/components/admin/Bdg";
import { KrediterPrivatModal } from "@/components/admin/KrediterPrivatModal";
import { OppdragModal, type OppdragModalData } from "@/components/admin/OppdragModal";
import { useAdminToast } from "@/components/admin/useAdminToast";
import { useAdminDrawer } from "@/lib/admin/AdminDrawerContext";

const C = colors;

type AdminOrderRow = MockOrder & { endringer?: OppdragEndring[] };

export function Oppdrag() {
  const { openDrawer } = useAdminDrawer();
  const { toast } = useAdminToast();
  const [orders, setOrders] = useState<AdminOrderRow[]>(() => JSON.parse(JSON.stringify(ORDERS)) as AdminOrderRow[]);
  const [filter, setFilter] = useState("Alle");
  const [selectedOppdrag, setSelectedOppdrag] = useState<OppdragModalData | null>(null);
  const [krediterOppdrag, setKrediterOppdrag] = useState<MockOrder | null>(null);

  const filters = ["Alle", "I dag", "Kommende", "Fullført", "Avlyst"];
  const filteredOrders = orders.filter((o) => {
    if (filter === "Alle") return true;
    if (filter === "I dag") return o.date?.includes("Man 3");
    if (filter === "Kommende") return o.status === "upcoming" || o.status === "tildelt";
    if (filter === "Fullført") return o.status === "completed";
    if (filter === "Avlyst") return o.status === "avlyst" || o.status === "cancelled";
    return true;
  });

  const handleSave = (updated: OppdragModalData, arsak: string, arsakType: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === updated.id
          ? {
              ...o,
              ...updated,
              status: arsakType === "sykepleier_syk" || arsakType === "kunde_syk" ? "avlyst" : o.status,
              endringer: [
                ...(updated.endringer ?? []),
                {
                  dato: new Date().toLocaleString("nb-NO"),
                  av: "Lise Andersen (admin)",
                  handling:
                    arsakType === "sykepleier_syk"
                      ? `Avlyst — sykepleier syk. ${updated.nurse ? `Ny: ${updated.nurse}` : "Ingen erstatning"}`
                      : arsakType === "bytte_sykepleier"
                        ? `Sykepleier endret → ${updated.nurse}`
                        : arsakType === "tidendring"
                          ? `Tid endret → ${updated.date} ${updated.time}`
                          : arsakType === "kunde_syk"
                            ? "Avlyst — kunde syk"
                            : "Endret",
                  arsak,
                },
              ],
            }
          : o,
      ),
    );
  };

  return (
    <div className="fu">
      {selectedOppdrag && (
        <OppdragModal
          oppdrag={selectedOppdrag}
          nurses={NURSES}
          onClose={() => setSelectedOppdrag(null)}
          onSave={handleSave}
        />
      )}
      {krediterOppdrag && (
        <KrediterPrivatModal
          prefilledOppdrag={krediterOppdrag}
          ordersCatalog={orders}
          onClose={() => setKrediterOppdrag(null)}
          onSave={() => setKrediterOppdrag(null)}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px",
                borderRadius: 50,
                fontSize: 11,
                fontWeight: filter === f ? 600 : 400,
                border: filter === f ? `1.5px solid ${C.green}` : `1px solid ${C.border}`,
                background: filter === f ? C.greenBg : "white",
                color: filter === f ? C.green : C.soft,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => openDrawer("oppdrag")} className="btn bp" style={{ fontSize: 11, padding: "7px 14px" }}>
          + Nytt oppdrag
        </button>
      </div>
      <div className="card tw">
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tjeneste</th>
              <th>Kunde</th>
              <th>Sykepleier</th>
              <th>Tid</th>
              <th>Status</th>
              <th>Beløp</th>
              <th>Handling</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                style={{
                  cursor: "pointer",
                  background: o.status === "avlyst" || o.status === "cancelled" ? "#FFFBFB" : "white",
                }}
              >
                <td style={{ fontFamily: "monospace", fontSize: 10, color: C.soft }}>{o.id}</td>
                <td style={{ fontWeight: 500 }}>{o.service}</td>
                <td>{o.customer}</td>
                <td style={{ color: C.soft }}>{o.nurse}</td>
                <td style={{ color: C.soft, whiteSpace: "nowrap" }}>
                  {o.date} {o.time}
                </td>
                <td>
                  <Bdg status={o.status} />
                </td>
                <td style={{ fontWeight: 600 }}>{o.amount} kr</td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const full =
                          OPPDRAG.find((op) => op.service === o.service && op.customer === o.customer) ??
                          ({
                            ...o,
                            phone: "—",
                            betaltVia: o.betaltVia ?? "vipps",
                            opprettet: o.date,
                            endringer: [{ dato: o.date + " " + o.time, av: "System", handling: "Bestilling opprettet", arsak: null }],
                          } as OppdragModalData);
                        setSelectedOppdrag(full);
                      }}
                      style={{
                        fontSize: 10,
                        padding: "3px 10px",
                        background: C.greenBg,
                        color: C.green,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ✏️ Endre
                    </button>
                    {(o.status === "upcoming" || o.status === "tildelt") && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("Avlysning registrert — kunden varsles", "ok");
                        }}
                        style={{
                          fontSize: 10,
                          padding: "3px 9px",
                          background: C.dangerBg,
                          color: C.danger,
                          border: `1px solid rgba(225,29,72,.15)`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🚫 Avlys
                      </button>
                    )}
                    {o.status !== "avlyst" && o.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKrediterOppdrag(o);
                        }}
                        style={{
                          fontSize: 10,
                          padding: "3px 9px",
                          background: "#F5F3FF",
                          color: "#6D28D9",
                          border: "1px solid #C4B5FD",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ↩️ Krediter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 16 }}>
        {[
          {
            t: "🤒 Sykepleier syk",
            txt: "Bytt sykepleier eller avlys. Full refusjon til kunde automatisk. Kunde varsles umiddelbart.",
            bg: "#F0FDF4",
            c: "#166534",
          },
          {
            t: "🤧 Kunde avlyser",
            txt: `${KANSELLERING_REGLER.fristTimer}t+ før: gratis. Under ${KANSELLERING_REGLER.gebyrProsent50}t: 50% gebyr. Under ${KANSELLERING_REGLER.gebyrProsent100}t: fullt gebyr.`,
            bg: C.goldBg,
            c: C.goldDark,
          },
          {
            t: "🕐 Tidsendring",
            txt: "Endre dato/tid på eksisterende bestilling. Ingen refusjon. Loggføres med hvem som endret.",
            bg: C.greenXL,
            c: C.navyMid,
          },
        ].map((b) => (
          <div key={b.t} style={{ background: b.bg, borderRadius: 10, padding: "11px 14px", border: `1px solid ${b.c}22` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: b.c, marginBottom: 4 }}>{b.t}</div>
            <div style={{ fontSize: 11, color: b.c, lineHeight: 1.55, opacity: 0.85 }}>{b.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
