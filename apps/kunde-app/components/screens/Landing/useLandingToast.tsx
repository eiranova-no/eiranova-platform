"use client";

import { useCallback, useState, type ReactNode } from "react";

import { colors } from "@eiranova/ui";

type ToastType = "ok" | "err" | "warn";

interface ToastEntry {
  id: number;
  msg: string;
  type: ToastType;
}

export interface UseLandingToastResult {
  toast: (msg: string, type?: ToastType, dur?: number) => void;
  ToastContainer: () => ReactNode;
}

export function useLandingToast(): UseLandingToastResult {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((msg: string, type: ToastType = "ok", dur = 2400) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), dur);
  }, []);

  const ToastContainer = useCallback(() => {
    return (
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
            className="fu"
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              color: "white",
              textAlign: "center",
              background:
                t.type === "ok"
                  ? colors.green
                  : t.type === "err"
                    ? colors.danger
                    : t.type === "warn"
                      ? colors.gold
                      : "#1A2E24",
              boxShadow: "0 4px 20px rgba(0,0,0,.25)",
            }}
          >
            {t.type === "ok" ? "✓ " : t.type === "err" ? "✗ " : t.type === "warn" ? "⚠ " : ""}
            {t.msg}
          </div>
        ))}
      </div>
    );
  }, [toasts]);

  return { toast, ToastContainer };
}
