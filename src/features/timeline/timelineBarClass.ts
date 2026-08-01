/** The priority-color modifier suffix for a timeline bar. High/Medium get their
 * own color (Asana colors bars by priority); Low/None keep the default accent.
 * Returns a leading-space class fragment (or '') so it appends cleanly. Pure. */
export function prioClass(priority: string | null | undefined): string {
  if (priority === 'HIGH') return ' timeline__bar--high';
  if (priority === 'MEDIUM') return ' timeline__bar--medium';
  return '';
}
