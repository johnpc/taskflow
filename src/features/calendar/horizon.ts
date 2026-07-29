/** Build the list of YYYY-MM-DD dates from `start` for `count` days (inclusive
 * of start). Pure given the start date — the impure "today" comes from the
 * caller (today.ts), keeping this testable. */
export function horizonDates(start: string, count: number): string[] {
  const [y, m, d] = start.split('-').map(Number);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    out.push(dt.toISOString().slice(0, 10));
  }
  return out;
}
