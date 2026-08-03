import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';

export interface DayGroup {
  /** YYYY-MM-DD. */
  date: string;
  /** Friendly label: "Today", "Tomorrow", or "Mon, Aug 3". */
  label: string;
  /** True when this group is the current day — the agenda accents its header. */
  isToday: boolean;
  tasks: TaskRecord[];
}

const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const DAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');

/** Human label for a date relative to today (both YYYY-MM-DD). */
export function dayLabel(date: string, today: string, tomorrow: string): string {
  if (date === today) return 'Today';
  if (date === tomorrow) return 'Tomorrow';
  const [y, m, d] = date.split('-').map(Number);
  const dow = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${dow}, ${MONTHS[m - 1]} ${d}`;
}

/** Group OPEN, dated tasks that fall on `today` or the next `days` days into
 * per-day buckets (chronological). Overdue and undated tasks are excluded — this
 * is the forward-looking calendar. `today`/`tomorrow` injected for determinism.
 * Pure + total. */
export function groupByDay(
  tasks: TaskRecord[],
  today: string,
  tomorrow: string,
  horizon: string[],
): DayGroup[] {
  const window = new Set(horizon);
  const byDate = new Map<string, TaskRecord[]>();
  for (const task of tasks) {
    if (isDone(task) || !task.dueDate || !window.has(task.dueDate)) continue;
    if (!byDate.has(task.dueDate)) byDate.set(task.dueDate, []);
    byDate.get(task.dueDate)!.push(task);
  }
  return horizon
    .filter((date) => byDate.has(date))
    .map((date) => ({
      date,
      label: dayLabel(date, today, tomorrow),
      isToday: date === today,
      tasks: byDate.get(date)!.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
    }));
}
