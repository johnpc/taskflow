import type { TaskRecord } from '../../lib/dataClient';
import type { Priority } from '../task/taskMeta';

/** A List-view sort column, or 'manual' to keep each group's own order. */
export type ListSortKey = 'manual' | 'title' | 'assignee' | 'due' | 'priority';

export interface ListSort {
  key: ListSortKey;
  dir: 'asc' | 'desc';
}

export const DEFAULT_LIST_SORT: ListSort = { key: 'manual', dir: 'asc' };

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };

/** Comparable key for a task under the chosen column (strings compare
 * lexically; missing values sort last in ascending order). */
function keyOf(task: TaskRecord, key: ListSortKey): string | number {
  if (key === 'title') return (task.title ?? '').toLowerCase();
  if (key === 'assignee') return (task.assigneeEmail ?? '￿').toLowerCase();
  if (key === 'due') return task.dueDate ?? '9999-99-99';
  if (key === 'priority') return PRIORITY_RANK[(task.priority ?? 'NONE') as Priority];
  return 0;
}

/** Sort a group's rows by the chosen column + direction. 'manual' returns the
 * input order unchanged. Pure + total (stable via index tiebreak). */
export function sortListRows(tasks: TaskRecord[], sort: ListSort): TaskRecord[] {
  if (sort.key === 'manual') return tasks;
  const factor = sort.dir === 'desc' ? -1 : 1;
  return tasks
    .map((task, i) => ({ task, i }))
    .sort((a, b) => {
      const ka = keyOf(a.task, sort.key);
      const kb = keyOf(b.task, sort.key);
      if (ka < kb) return -1 * factor;
      if (ka > kb) return 1 * factor;
      return a.i - b.i;
    })
    .map((x) => x.task);
}

/** Next sort state when a column header is clicked: activate ascending, or flip
 * direction if already active on that column. */
export function toggleListSort(current: ListSort, key: ListSortKey): ListSort {
  if (current.key !== key) return { key, dir: 'asc' };
  return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' };
}
