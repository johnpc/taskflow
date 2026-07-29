/** Format an ISO timestamp as a short relative label ("just now", "3h ago",
 * "2d ago", "Aug 3") relative to `now` (ms). Injected `now` keeps it
 * deterministic + testable. Returns '' for a missing/invalid timestamp. */
export function relativeTime(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return '';
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return '';
  const diffSec = Math.round((nowMs - then) / 1000);
  if (diffSec < 45) return 'just now';
  const mins = Math.round(diffSec / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  const d = new Date(then);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
