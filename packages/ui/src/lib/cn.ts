/** Join truthy class name fragments (prototype uses template strings; keep a single helper for migrations). */
export function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}
