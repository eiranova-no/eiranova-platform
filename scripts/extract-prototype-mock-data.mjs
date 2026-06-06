/**
 * Generates packages/mock-data/src/generated/prototype-fixtures.ts from the UX reference prototype.
 * Source: docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx
 * Run from repo root: pnpm --filter @eiranova/mock-data generate
 * (or: node scripts/extract-prototype-mock-data.mjs)
 * After changing output shape, commit the file; CI runs pnpm verify:mock-data-generated.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const protoPath = path.join(
  root,
  "docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx",
);
const src = fs.readFileSync(protoPath, "utf8");

const C = {
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
};

function replaceCRefs(blob) {
  let out = blob;
  const keys = Object.keys(C).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const v = C[k];
    out = out.split(`C.${k}`).join(JSON.stringify(v));
  }
  return out;
}

/** Extract `{...}` or `[...]` starting at start index (first char must be { or [) */
function sliceBalancedFrom(start) {
  const stack = [];
  let inStr = null;
  let esc = false;
  const openOf = { "{": "}", "[": "]", "(": ")" };
  for (let k = start; k < src.length; k++) {
    const c = src[k];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "{" || c === "[" || c === "(") {
      stack.push(openOf[c]);
      continue;
    }
    if (c === "}" || c === "]" || c === ")") {
      if (!stack.length || stack[stack.length - 1] !== c) {
        throw new Error(`Unbalanced ${c} at ${k}`);
      }
      stack.pop();
      if (stack.length === 0) {
        return src.slice(start, k + 1);
      }
    }
  }
  throw new Error("Unclosed bracket");
}

function extractAfterEquals(name) {
  const prefix = `const ${name}=`;
  const i = src.indexOf(prefix);
  if (i < 0) throw new Error(`Missing const ${name}`);
  let j = i + prefix.length;
  while (j < src.length && /\s/.test(src[j])) j++;
  const first = src[j];
  if (first !== "{" && first !== "[") {
    // e.g. number, string, Date.parse — take until semicolon at paren depth 0
    let depth = 0;
    let inStr = null;
    let esc = false;
    for (let k = j; k < src.length; k++) {
      const c = src[k];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === inStr) inStr = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        inStr = c;
        continue;
      }
      if (c === "(") depth++;
      if (c === ")") depth--;
      if (c === ";" && depth === 0) {
        return src.slice(j, k).trim();
      }
    }
    throw new Error(`No semicolon for ${name}`);
  }
  return sliceBalancedFrom(j);
}

function extractFunctionSource(name) {
  const prefix = `function ${name}`;
  const i = src.indexOf(prefix);
  if (i < 0) throw new Error(`Missing function ${name}`);
  let j = i + prefix.length;
  while (j < src.length && src[j] !== "{") j++;
  const bodyStart = j;
  const stack = [];
  let inStr = null;
  let esc = false;
  const openOf = { "{": "}", "[": "]", "(": ")" };
  for (let k = bodyStart; k < src.length; k++) {
    const c = src[k];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "{" || c === "[" || c === "(") {
      stack.push(openOf[c]);
      continue;
    }
    if (c === "}" || c === "]" || c === ")") {
      if (!stack.length || stack[stack.length - 1] !== c) {
        throw new Error(`Bad close in ${name}`);
      }
      stack.pop();
      if (stack.length === 0) {
        return replaceCRefs(src.slice(i, k + 1));
      }
    }
  }
  throw new Error(`Unclosed function ${name}`);
}

const arrayAndObjectExports = [
  "INIT_TJENESTER_CATALOG",
  "ORDERS",
  "NURSES",
  "OPPDRAG",
  "CHAT",
  "B2B_C",
  "B2B_INV",
  "MOCK_B2B_HENVENDELSER",
  "VIPPS_P",
  "STRIPE_P",
  "WH",
  "INIT_STAFF",
  "INIT_B2B_TILGANGER",
  "INIT_AVTALEMODELLER",
  "INIT_VIKARER",
  "BEMANNING_BYRAER",
  "B2B_COORD_BRUKERE",
  "PAKKER",
  "ANSATTE_LONN",
  "LONNKJORINGER",
  "KREDITERINGER",
  "BN_K",
  "NURSE_NAV",
  "ANAV",
  "TABS",
  "ADMIN_SC",
  "SC",
  "KUNDE_SCREEN_PATH",
  "TARIFF_INFO",
  "KANSELLERING_REGLER",
  "NURSE_PROFIL_SPESIALITETER_CHIPS",
  "NURSE_PROFIL_OMRADE_CHIPS",
  "NURSE_TITTEL_OPTIONS",
  "INTERNE_ROLLER",
  "B2B_ROLLER",
  "ROLLE_INFO",
  "ROLLE_TILGANGER",
];

const outFile = path.join(
  root,
  "packages/mock-data/src/generated/prototype-fixtures.ts",
);
fs.mkdirSync(path.dirname(outFile), { recursive: true });

let out = `/**
 * AUTO-GENERATED — do not edit manually.
 * Regenerate: pnpm --filter @eiranova/mock-data generate
 * (equivalent: node scripts/extract-prototype-mock-data.mjs from repo root)
 * Source: docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx
 * Drift check: pnpm verify:mock-data-generated (also runs in CI)
 */

`;

for (const name of arrayAndObjectExports) {
  const raw = replaceCRefs(extractAfterEquals(name));
  out += `export const ${name} = ${raw};\n\n`;
}

out += `export const ROLES = [...INTERNE_ROLLER, ...B2B_ROLLER];\n\n`;

out += `export const NURSE_PROFIL_MOCK_INDEKS = 1;\n\n`;

out += `export const MOCK_KUNDE_INNLOGGET_EPOST = "astrid@example.com";\n\n`;

out += `export const TOAST_AVBESTILLING_BEKREFTET = ${JSON.stringify(
  "Avbestilling bekreftet. Bekreftelse er sendt til din e-post. Refusjon kommer innen 3–5 virkedager.",
)};\n\n`;

out += `export const PROTOTYPE_NOW_MS = Date.parse("2026-03-03T11:00:00+01:00");\n\n`;

const fns = [
  "catalogTilKundeServices",
  "parseErfaringAar",
  "sykepleierOmradeTilChips",
  "profilEndringSammendrag",
  "orderStartMsForAvbestilling",
  "prototypeTimerTilOppstart",
  "kundeOrdreHistorisk",
  "kundeKanAvbestilleSelv",
  "kundeMaKontakteForAvbestilling",
  "kundeAvbestiltRefusjonInfotekst",
  "mockKundeNesteAvtale",
  "nurseDefaultInnsjekkOppdragId",
];

for (const fn of fns) {
  out += extractFunctionSource(fn) + "\n\n";
}

out += `export const DEFAULT_KUNDE_SERVICES = catalogTilKundeServices(INIT_TJENESTER_CATALOG);\n`;

out += `
export const KUNDE_NAV_TAB_IDS = new Set(BN_K.map((t) => t.id));

export const KUNDE_NAV_SHELL_ROOT_IDS = new Set([
  "hjem",
  "bestill",
  "mine",
  "chat-kunde",
  "kunde-profil",
]);
`;

fs.writeFileSync(outFile, out);

let patched = fs.readFileSync(outFile, "utf8");
patched = patched.replace(
  " */\n\n",
  ` */\n\nimport type {\n  KundeFacingService,\n  MockOrder,\n  NurseProfileLike,\n  OppdragEntry,\n  TjenesteCatalogEntry,\n} from "../types";\n\n`,
);

const sigs = [
  [
    "function catalogTilKundeServices(tjenester){",
    "export function catalogTilKundeServices(tjenester: readonly TjenesteCatalogEntry[]): KundeFacingService[] {",
  ],
  [
    "function parseErfaringAar(erfaringStr){",
    "export function parseErfaringAar(erfaringStr: string | undefined): number {",
  ],
  [
    "function sykepleierOmradeTilChips(omradeStr){",
    "export function sykepleierOmradeTilChips(omradeStr: string | undefined): string[] {",
  ],
  [
    "function profilEndringSammendrag(gammel,apply){",
    "export function profilEndringSammendrag(gammel: NurseProfileLike, apply: NurseProfileLike): string {",
  ],
  [
    "function orderStartMsForAvbestilling(o){",
    "export function orderStartMsForAvbestilling(o: MockOrder): number {",
  ],
  [
    "function prototypeTimerTilOppstart(o){",
    "export function prototypeTimerTilOppstart(o: MockOrder): number | null {",
  ],
  [
    "function kundeOrdreHistorisk(o){",
    "export function kundeOrdreHistorisk(o: MockOrder): boolean {",
  ],
  [
    "function kundeKanAvbestilleSelv(o){",
    "export function kundeKanAvbestilleSelv(o: MockOrder): boolean {",
  ],
  [
    "function kundeMaKontakteForAvbestilling(o){",
    "export function kundeMaKontakteForAvbestilling(o: MockOrder): boolean {",
  ],
  [
    "function kundeAvbestiltRefusjonInfotekst(order){",
    "export function kundeAvbestiltRefusjonInfotekst(order: MockOrder): string {",
  ],
  [
    "function mockKundeNesteAvtale(){",
    "export function mockKundeNesteAvtale(): OppdragEntry | undefined {",
  ],
  [
    "function nurseDefaultInnsjekkOppdragId(){",
    "export function nurseDefaultInnsjekkOppdragId(): string {",
  ],
];
for (const [from, to] of sigs) {
  if (!patched.includes(from)) {
    throw new Error(`Patch miss: ${from.slice(0, 40)}`);
  }
  patched = patched.split(from).join(to);
}

fs.writeFileSync(outFile, patched);
console.log("Wrote", outFile);
