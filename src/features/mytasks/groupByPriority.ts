import type { TaskRecord } from '../../lib/dataClient';
import { isDone, type Priority } from '../task/taskMeta';
import type { TaskBucket } from './groupByDue';

const ORDER: { key: Priority; label: string }[] = [
  { key: 'HIGH', label: 'High priority' },
  { key: 'MEDIUM', label: 'Medium priority' },
  { key: 'LOW', label: 'Low priority' },
  { key: 'NONE', label: 'No priority' },
];

/** Group the owner's OPEN tasks into priority buckets (High → None). Within a
 * bucket, tasks sort by due date then title. Empty buckets drop. Pure + total. */
export function groupByPriority(tasks: TaskRecord[]): TaskBucket[] {
  const open = tasks.filter((t) => !isDone(t));
  const byKey = new Map<Priority, TaskRecord[]>(ORDER.map((b) => [b.key, []]));
  for (const task of open) {
    const key: Priority = (task.priority as Priority) ?? 'NONE';
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
