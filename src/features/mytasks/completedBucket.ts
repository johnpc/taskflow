import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';
import type { TaskBucket } from './groupByDue';

/** A single "Completed" bucket of the owner's DONE top-level tasks, most-
 * recently-completed first, or [] when none. Appended below the open buckets
 * on My Tasks when "Show completed" is on. Pure + total. */
export function completedBucket(tasks: TaskRecord[]): TaskBucket[] {
  const done = tasks.filter((t) => isDone(t) && !t.parentTaskId);
  if (done.length === 0) return [];
  done.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  return [{ key: 'completed', label: 'Completed', tasks: done }];
}
