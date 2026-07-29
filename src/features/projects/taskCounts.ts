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

export interface Progress {
  done: number;
  total: number;
}

/** Completion progress per project: done vs total top-level tasks (subtasks
 * excluded, matching the open-count rule). Projects with no tasks are absent.
 * Pure so the progress bars are deterministic. */
export function progressByProject(tasks: TaskRecord[]): Map<string, Progress> {
  const map = new Map<string, Progress>();
  for (const task of tasks) {
    if (task.parentTaskId) continue;
    const p = map.get(task.projectId) ?? { done: 0, total: 0 };
    p.total += 1;
    if (isDone(task)) p.done += 1;
    map.set(task.projectId, p);
  }
  return map;
}

/** Whole-number completion percent (0–100) for a progress pair; 0 when empty. */
export function progressPercent({ done, total }: Progress): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
