/** Due-date quick presets, computed from an injected `today` (YYYY-MM-DD) so
 * they're deterministic + testable. "Next week" is 7 days out. */
export interface DuePreset {
  key: 'today' | 'tomorrow' | 'nextWeek';
  label: string;
  date: string;
}

/** Add `days` to a YYYY-MM-DD date (UTC math avoids DST drift). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** The three presets relative to today. */
export function duePresets(today: string): DuePreset[] {
  return [
    { key: 'today', label: 'Today', date: today },
    { key: 'tomorrow', label: 'Tomorrow', date: addDays(today, 1) },
    { key: 'nextWeek', label: 'Next week', date: addDays(today, 7) },
  ];
}
