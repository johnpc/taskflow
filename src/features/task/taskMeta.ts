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
export function dueLabel(dueDate: string | null | undefined, today: string): string {
  const status = dueStatus(dueDate, today, false);
  if (status === 'none') return '';
  if (status === 'today') return 'Today';
  if (status === 'overdue') return 'Overdue';
  const [, m, d] = dueDate!.split('-').map(Number);
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  return `${months[m - 1]} ${d}`;
}
