import type { TaskRecord } from '../../lib/dataClient';

export type Priority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

/** Priority display label + the --tf-* token key for its accent. */
export const PRIORITY_META: Record<Priority, { label: string; token: string }> = {
  NONE: { label: 'No priority', token: 'text-muted' },
  LOW: { label: 'Low', token: 'priority-low' },
  MEDIUM: { label: 'Medium', token: 'priority-medium' },
  HIGH: { label: 'High', token: 'priority-high' },
};

/** Whether a task counts as done (completed status). */
export function isDone(task: Pick<TaskRecord, 'status'>): boolean {
  return task.status === 'DONE';
}

/** Classify a due date relative to `today` (YYYY-MM-DD strings). Returns the
 * bucket the UI colors: overdue (past + not done), today, upcoming, or none.
 * Time is injected (today) so it's deterministic + testable. */
export function dueStatus(
  dueDate: string | null | undefined,
  today: string,
  done: boolean,
): 'none' | 'overdue' | 'today' | 'upcoming' {
  if (!dueDate) return 'none';
  if (dueDate === today) return 'today';
  if (dueDate < today) return done ? 'upcoming' : 'overdue';
  return 'upcoming';
}

/** Short, human due-date label, e.g. "Today", "Overdue", or "Aug 3". Injected
 * `today` keeps it deterministic. */
/** The YYYY-MM-DD one calendar day after `date` (UTC). Pure. */
function nextDay(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

export function dueLabel(dueDate: string | null | undefined, today: string): string {
  const status = dueStatus(dueDate, today, false);
  if (status === 'none') return '';
  if (status === 'today') return 'Today';
  if (status === 'overdue') return 'Overdue';
  if (dueDate === nextDay(today)) return 'Tomorrow';
  const [, m, d] = dueDate!.split('-').map(Number);
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  return `${months[m - 1]} ${d}`;
}

/** Format an HH:MM (24h) time string as a 12h clock label, e.g. "2:00 PM".
 * Returns '' for an empty/malformed value. Pure. */
export function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return '';
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/** The due chip label with an optional time appended, e.g. "Today 9:00 AM" or
 * "Aug 3 2:00 PM". Falls back to the plain date label when there's no time. */
export function dueLabelWithTime(
  dueDate: string | null | undefined,
  dueTime: string | null | undefined,
  today: string,
): string {
  const base = dueLabel(dueDate, today);
  const time = base ? formatTime(dueTime) : '';
  return time ? `${base} ${time}` : base;
}

/** A task hasn't started yet when its start date is strictly after today
 * (and it isn't done). Pure; time injected. */
export function startsInFuture(
  startDate: string | null | undefined,
  today: string,
  done: boolean,
): boolean {
  return !done && !!startDate && startDate > today;
}

/** "Starts Mon D" label for a future start date, else ''. Reuses the month
 * formatting from dueLabel. */
export function startLabel(startDate: string | null | undefined, today: string): string {
  if (!startDate || startDate <= today) return '';
  const [, m, d] = startDate.split('-').map(Number);
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  return `Starts ${months[m - 1]} ${d}`;
}
