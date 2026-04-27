/** Email shape check (matches prototype erGyldigEpost). */
export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

/** At least two whitespace-separated name parts (matches prototype fulltNavnMinToOrd). */
export function hasFullNameTwoWords(navn: string): boolean {
  const ord = String(navn || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return ord.length >= 2;
}
