"use client";

import { useEffect, useState } from "react";

import { breakpointPrototypeDesktopPx } from "../tokens";

/**
 * Desktop vs. mobil for kunde-landing. SSR and first client pass must use mobile (false)
 * so hydration matches; desktop activates after mount (same as prototype useViewportMin768).
 */
export function useViewportMin768(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width:${breakpointPrototypeDesktopPx}px)`,
    );
    setDesktop(mq.matches);
    const cb = (): void => setDesktop(mq.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return desktop;
}
