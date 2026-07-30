import type { TaskRecord } from '../../lib/dataClient';

/** Whole-day difference b - a for YYYY-MM-DD strings (UTC calendar days). */
function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/** Add `n` days to a YYYY-MM-DD string (UTC), returning YYYY-MM-DD. */
function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Patch to move a task's bar so its DUE date lands on `newDue`. If the task
 * also has a start date, shift it by the same delta so the bar's span is
 * preserved (Asana drags the whole bar). Returns null when nothing changes. */
export function reschedulePatch(
  task: TaskRecord,
  newDue: string,
): { id: string; dueDate: string; startDate?: string } | null {
  if (!task.dueDate || newDue === task.dueDate) return null;
  const patch: { id: string; dueDate: string; startDate?: string } = {
    id: task.id,
    dueDate: newDue,
  };
  if (task.startDate) patch.startDate = addDays(task.startDate, dayDiff(task.dueDate, newDue));
  return patch;
}
