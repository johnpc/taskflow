import type { TaskRecord } from '../../lib/dataClient';
import { isDone, type Priority } from '../task/taskMeta';

/** Case-insensitive substring match of a query against a task's title + notes.
 * A blank/whitespace query matches nothing (the search screen shows a prompt
 * instead of the whole table). Pure + total. */
export function matchTasks(tasks: TaskRecord[], query: string): TaskRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tasks.filter((t) => {
    const haystack = `${t.title ?? ''} ${t.notes ?? ''}`.toLowerCase();
    return haystack.includes(q);
  });
}

export interface SearchFilters {
  /** '' = any priority; otherwise only tasks with this priority. */
  priority: Priority | '';
  /** When true, completed tasks are excluded. */
  hideDone: boolean;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = { priority: '', hideDone: false };

/** Narrow already-matched tasks by priority and completion. Pure + total. */
export function filterResults(tasks: TaskRecord[], f: SearchFilters): TaskRecord[] {
  return tasks.filter((t) => {
    if (f.hideDone && isDone(t)) return false;
    if (f.priority && (t.priority ?? 'NONE') !== f.priority) return false;
    return true;
  });
}
