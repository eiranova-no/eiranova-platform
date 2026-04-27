"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { MockOrder } from "@eiranova/mock-data";
import {
  BN_K,
  ORDERS,
  TOAST_AVBESTILLING_BEKREFTET,
  kundeAvbestiltRefusjonInfotekst,
  kundeKanAvbestilleSelv,
  kundeMaKontakteForAvbestilling,
  kundeOrdreHistorisk,
} from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { useLandingToast } from "../Landing/useLandingToast";
import { ProfilHeader } from "../KundeProfil/KundeProfil";
import { KundeAvbestillBekreftModal } from "./KundeAvbestillBekreftModal";
import { KundeAvtaleDetalj } from "./KundeAvtaleDetalj";
import { KundeBdg } from "./KundeBdg";
import { KundeOppdragDetalj } from "./KundeOppdragDetalj";

const C = colors;

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

/**
 * Kunde: mine bestillinger + URL-styrt detalj `?order=` / `?vis=avtale` (prototype ~2611).
 */
export function Mine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, ToastContainer } = useLandingToast();
  const [tab, setTab] = useState<"kommende" | "tidligere">("kommende");
  const [avbestillFor, setAvbestillFor] = useState<string | null>(null);
  const [orders, setOrders] = useState<MockOrder[]>(() => JSON.parse(JSON.stringify(ORDERS)) as MockOrder[]);

  const orderParam = searchParams.get("order");
  const visAvtale = searchParams.get("vis") === "avtale";

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

  const onKundeOrderAvbestill = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (String(o.id) !== String(orderId) ? o : { ...o, status: "cancelled" })),
    );
  }, []);

  const avbestillOrder = avbestillFor ? orders.find((x) => String(x.id) === String(avbestillFor)) : null;

  if (orderParam) {
    return (
      <KundeOppdragDetalj
        orderId={orderParam}
        orders={orders}
        onNav={onNav}
        onKundeOrderAvbestill={onKundeOrderAvbestill}
      />
    );
  }

  if (visAvtale) {
    return <KundeAvtaleDetalj onNav={onNav} />;
  }

  return (
    <div className="phone fu">
      <ToastContainer />
      <ProfilHeader title="Mine bestillinger" onBack={() => onNav("hjem")} backLabel="Hjem" centerTitle />
      <div style={{ display: "flex", margin: "10px 11px", background: C.greenXL, borderRadius: 9, padding: 3, flexShrink: 0 }}>
        {(["kommende", "tidligere"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              background: tab === t ? "white" : "transparent",
              color: tab === t ? C.green : C.soft,
              fontFamily: "inherit",
            }}
          >
            {t === "kommende" ? "Kommende" : "Tidligere"}
          </button>
        ))}
      </div>
      <div className="sa" style={{ padding: "0 11px" }}>
        {orders
          .filter((o) => (tab === "kommende" ? !kundeOrdreHistorisk(o) : kundeOrdreHistorisk(o)))
          .map((o) => (
            <div
              key={o.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNav("kunde-oppdrag-detalj", null, { orderId: o.id });
                }
              }}
              onClick={() => onNav("kunde-oppdrag-detalj", null, { orderId: o.id })}
              className="card"
              style={{ marginBottom: 8, cursor: "pointer" }}
            >
              <div style={{ height: 2.5, background: o.cat === "barsel" ? C.gold : C.green }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{o.service}</div>
                    <div style={{ fontSize: 9, color: C.soft, marginTop: 1 }}>
                      {o.date} · {o.time}
                    </div>
                  </div>
                  <KundeBdg status={o.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.navyMid }}>
                  <span>Sykepleier: {o.nurse}</span>
                  <span style={{ fontWeight: 600, color: o.paid ? C.green : C.goldDark }}>
                    {o.paid ? "✓ Betalt" : "⏳ Ubetalt"} · {o.amount} kr
                  </span>
                </div>
                {o.status === "cancelled" && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 10px",
                      background: C.greenXL,
                      borderRadius: 8,
                      border: "1px solid rgba(74,124,111,.2)",
                      fontSize: 10,
                      color: C.navyMid,
                      lineHeight: 1.45,
                    }}
                  >
                    {kundeAvbestiltRefusjonInfotekst(o)}
                  </div>
                )}
                {o.status === "no_show" && (
                  <div style={{ marginTop: 8, fontSize: 10, color: C.soft, lineHeight: 1.45 }}>Ingen refusjon ved uteblivelse.</div>
                )}
                {!o.paid && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("Går til betaling (prototyp)", "warn");
                    }}
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "7px",
                      background: C.vipps,
                      color: "white",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 10,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Betal nå
                  </button>
                )}
                {tab === "kommende" && !kundeOrdreHistorisk(o) && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {kundeKanAvbestilleSelv(o) && (
                      <button
                        type="button"
                        onClick={() => setAvbestillFor(o.id)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 8,
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          background: "white",
                          color: C.danger,
                          border: `1.5px solid ${C.danger}`,
                        }}
                      >
                        Avbestill
                      </button>
                    )}
                    {kundeMaKontakteForAvbestilling(o) && (
                      <button
                        type="button"
                        onClick={() => onNav("chat-kunde")}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 8,
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          background: C.greenBg,
                          color: C.greenDark,
                          border: `1.5px solid ${C.border}`,
                        }}
                      >
                        Kontakt oss
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {avbestillOrder && (
        <KundeAvbestillBekreftModal
          order={avbestillOrder}
          onLukk={() => setAvbestillFor(null)}
          onBekreft={() => {
            onKundeOrderAvbestill(avbestillOrder.id);
            setAvbestillFor(null);
            toast(TOAST_AVBESTILLING_BEKREFTET, "ok");
          }}
        />
      )}
      <BNav active="mine" onNav={onNav} items={BN_K} />
      <DeskNav active="mine" onNav={onNav} items={BN_K} title="EiraNova" />
    </div>
  );
}
