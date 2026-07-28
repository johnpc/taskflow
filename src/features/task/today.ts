/** Today's date as a YYYY-MM-DD string in the user's local timezone. Isolated
 * here so pure due-date helpers (taskMeta) can take an injected `today` and
 * stay deterministic — only this one impure function reads the clock. */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Current time as an ISO-8601 timestamp (for completedAt, comment order). */
export function nowISO(): string {
  return new Date().toISOString();
}
