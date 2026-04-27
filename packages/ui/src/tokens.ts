/**
 * Design tokens aligned with EiraNova prototype (`C` in HANDOFF) and .cursorrules.
 * Use these from TS instead of hardcoding hex in new components.
 */
export const colors = {
  green: "#4A7C6F",
  greenDark: "#2C5C52",
  greenLight: "#7FAE96",
  greenBg: "#EDF5F3",
  greenXL: "#F4FAF8",
  rose: "#E8A4A4",
  roseDark: "#C47C7C",
  roseBg: "#FDF0F0",
  gold: "#C4956A",
  goldDark: "#A07040",
  goldBg: "#FDF5EE",
  cream: "#FAF6F1",
  navy: "#2C3E35",
  navyMid: "#4A5E55",
  soft: "#7A8E85",
  border: "#E4EDE9",
  softBg: "#F0F5F2",
  vipps: "#FF5B24",
  danger: "#E11D48",
  dangerBg: "#FFF1F2",
  sky: "#2563EB",
  skyBg: "#EFF6FF",
  sidebar: "#1E3A2F",
  sidebarActive: "rgba(74,188,158,0.18)",
  sidebarText: "rgba(255,255,255,0.75)",
  sidebarMuted: "rgba(255,255,255,0.35)",
  sidebarAccent: "#4ABC9E",
} as const;

export type ColorToken = keyof typeof colors;

/** Product rule: phone-shell vs full webapp */
export const breakpointPhoneShellPx = 700;

/**
 * Prototype layout uses 768px for land-desktop vs mobile landing and nurse shell.
 * Keep explicit while migrating so parity checks match the reference.
 */
export const breakpointPrototypeDesktopPx = 768;
