import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';
import type { TaskBucket } from './groupByDue';

export type FocusBucket = 'TODAY' | 'UPCOMING' | 'LATER' | 'NONE';

const ORDER: { key: FocusBucket; label: string }[] = [
  { key: 'TODAY', label: 'Today' },
  { key: 'UPCOMING', label: 'Upcoming' },
  { key: 'LATER', label: 'Later' },
  { key: 'NONE', label: 'Unsorted' },
];

/** Group the owner's OPEN tasks by their manual focus bucket (Today → Unsorted),
 * independent of due date. Within a bucket, tasks sort by due date then title.
 * Empty buckets drop. Pure + total. */
export function groupByFocus(tasks: TaskRecord[]): TaskBucket[] {
  const open = tasks.filter((t) => !isDone(t));
  const byKey = new Map<FocusBucket, TaskRecord[]>(ORDER.map((b) => [b.key, []]));
  for (const task of open) {
    const key = (task.myBucket as FocusBucket) ?? 'NONE';
    (byKey.get(key) ?? byKey.get('NONE')!).push(task);
  }
  for (const list of byKey.values()) {
    list.sort(
      (a, b) =>
        (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') ||
        (a.title ?? '').localeCompare(b.title ?? ''),
    );
  }
  return ORDER.map((b) => ({ ...b, tasks: byKey.get(b.key)! })).filter((b) => b.tasks.length > 0);
}
