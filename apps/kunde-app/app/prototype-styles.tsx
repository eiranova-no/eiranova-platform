"use client";

import { CSS } from "../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";

/**
 * Injects the prototype handoff global CSS (fonts, .phone, .btn, .inp, …).
 * Required for all screens imported from the prototype file.
 */
export function PrototypeStyles() {
  return <style>{CSS}</style>;
}
