import type { TaskRecord } from '../../lib/dataClient';

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
