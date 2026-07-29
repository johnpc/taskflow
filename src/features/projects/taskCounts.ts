import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone } from '../task/taskMeta';

/** Count of OPEN (not done) top-level tasks per projectId. Subtasks excluded
 * (they're managed inside a task). Pure so the badge counts are deterministic. */
export function openCountByProject(tasks: TaskRecord[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    if (task.parentTaskId || isDone(task)) continue;
    counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
  }
  return counts;
}

/** How many open tasks are overdue relative to `today` (YYYY-MM-DD). */
export function overdueCount(tasks: TaskRecord[], today: string): number {
  return tasks.filter((t) => !isDone(t) && dueStatus(t.dueDate, today, false) === 'overdue').length;
}
