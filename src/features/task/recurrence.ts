/** Task recurrence rules + the pure date math for advancing a due date. Kept
 * separate so the logic is unit-testable and callers inject the date string. */

export type Repeat = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export const REPEAT_META: Record<Repeat, string> = {
  NONE: 'Does not repeat',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
};

/** Whether a repeat rule is active (non-null and not NONE). */
export function repeats(repeat: Repeat | null | undefined): boolean {
  return !!repeat && repeat !== 'NONE';
}

/** Advance a YYYY-MM-DD date by one period of the rule. Monthly clamps to the
 * last valid day (e.g. Jan 31 + 1mo → Feb 28/29). Returns null when there's no
 * date or no active rule — i.e. nothing to roll forward. */
export function nextDueDate(
  dueDate: string | null | undefined,
  repeat: Repeat | null | undefined,
): string | null {
  if (!dueDate || !repeats(repeat)) return null;
  const [y, m, d] = dueDate.split('-').map(Number); // m is 1-indexed
  if (repeat === 'DAILY') return iso(new Date(Date.UTC(y, m - 1, d + 1)));
  if (repeat === 'WEEKLY') return iso(new Date(Date.UTC(y, m - 1, d + 7)));
  // MONTHLY: same day next month (0-indexed month `m`), clamped to that
  // month's length so Jan 31 → Feb 28/29 rather than spilling into March.
  const lastDayNextMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return iso(new Date(Date.UTC(y, m, Math.min(d, lastDayNextMonth))));
}

/** A UTC Date → YYYY-MM-DD. */
function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}
