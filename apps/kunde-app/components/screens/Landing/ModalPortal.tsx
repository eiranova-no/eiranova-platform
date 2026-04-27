"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ModalPortalProps {
  children: ReactNode;
  overlayStyle?: React.CSSProperties;
}

export function ModalPortal({ children, overlayStyle }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const safePad =
    "max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))";

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: safePad,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...overlayStyle,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
