"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { BN_K, CHAT } from "@eiranova/mock-data";
import { colors } from "@eiranova/ui";

import { ProfilHeader } from "../KundeProfil/KundeProfil";

const C = colors;

interface ChatLine {
  from: "nurse" | "customer";
  text: string;
  time: string;
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

function normalizeInitialChat(): ChatLine[] {
  return CHAT.map((m) => ({
    from: m.from === "customer" ? "customer" : "nurse",
    text: m.text,
    time: m.time,
  }));
}

/**
 * Kunde: chat med sykepleier (prototype `ChatKunde` ~2669).
 */
export function ChatKunde() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<ChatLine[]>(normalizeInitialChat);

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

  const send = useCallback(() => {
    if (!msg.trim()) return;
    setMsgs((p) => [...p, { from: "customer", text: msg.trim(), time: "nå" }]);
    setMsg("");
  }, [msg]);

  return (
    <div className="phone fu">
      <ProfilHeader
        title="Sara Lindgren · Sykepleier"
        onBack={() => onNav("hjem")}
        backLabel="Hjem"
        centerTitle
        slim
      />
      <div
        className="sa"
        style={{
          padding: "10px 11px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: C.greenXL,
        }}
      >
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "customer" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "75%",
                background: m.from === "customer" ? C.green : "white",
                borderRadius: m.from === "customer" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                padding: "8px 11px",
              }}
            >
              <div style={{ fontSize: 12, color: m.from === "customer" ? "white" : C.navy, lineHeight: 1.45 }}>{m.text}</div>
              <div
                style={{
                  fontSize: 8,
                  color: m.from === "customer" ? "rgba(255,255,255,.65)" : C.soft,
                  marginTop: 2,
                  textAlign: "right",
                }}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 11px", background: "white", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Skriv en melding..."
          style={{
            flex: 1,
            padding: "8px 11px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 18,
            fontSize: 12,
            outline: "none",
            background: C.greenXL,
            fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={send}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: C.green,
            color: "white",
            border: "none",
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↑
        </button>
      </div>
      <BNav active="chat-kunde" onNav={onNav} items={BN_K} />
      <DeskNav active="chat-kunde" onNav={onNav} items={BN_K} title="EiraNova" />
    </div>
  );
}
