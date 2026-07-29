import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone } from '../task/taskMeta';

export type DueBucketKey = 'overdue' | 'today' | 'upcoming' | 'noDate';

/** A named group of tasks shown as one section on My Tasks. Shared by every
 * grouping strategy (due date, priority) so the view renders them uniformly. */
export interface TaskBucket {
  key: string;
  label: string;
  tasks: TaskRecord[];
}

export interface DueBucket extends TaskBucket {
  key: DueBucketKey;
}

const ORDER: { key: DueBucketKey; label: string }[] = [
  { key: 'overdue', label: 'Overdue' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'noDate', label: 'No due date' },
];

/** Group the owner's OPEN tasks (done excluded) into due buckets relative to
 * `today` (injected for determinism). Within a bucket, tasks sort by due date
 * then title. Empty buckets are dropped. Pure + total. */
export function groupByDue(tasks: TaskRecord[], today: string): DueBucket[] {
  const open = tasks.filter((t) => !isDone(t));
  const byKey = new Map<DueBucketKey, TaskRecord[]>(ORDER.map((b) => [b.key, []]));
  for (const task of open) {
    const status = dueStatus(task.dueDate, today, false);
    const key: DueBucketKey = status === 'none' ? 'noDate' : status;
    byKey.get(key)!.push(task);
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
