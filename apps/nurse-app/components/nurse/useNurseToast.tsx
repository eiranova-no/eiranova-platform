"use client";

import { colors } from "@eiranova/ui";
import { useCallback, useState } from "react";

const C = colors;

interface ToastRow {
  id: number;
  msg: string;
  type: "ok" | "err" | "warn" | "info" | string;
}

export function useNurseToast() {
  const [toasts, setToasts] = useState<ToastRow[]>([]);

  const toast = useCallback((msg: string, type: ToastRow["type"] = "ok", dur = 2400) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), dur);
  }, []);

  const ToastContainer = () => (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
        minWidth: 220,
        maxWidth: 340,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            background:
              t.type === "ok"
                ? C.green
                : t.type === "err"
                  ? C.danger
                  : t.type === "warn"
                    ? C.gold
                    : t.type === "info"
                      ? "#1A2E24"
                      : "#1A2E24",
            boxShadow: "0 4px 20px rgba(0,0,0,.25)",
            animation: "fadeInUp .2s ease",
          }}
        >
          {t.type === "ok" ? "✓ " : t.type === "err" ? "✗ " : t.type === "warn" ? "⚠ " : ""}
          {t.msg}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}
