import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';
import type { TaskBucket } from './groupByDue';

/** Group the owner's OPEN tasks by label: a task appears under EVERY label it
 * carries (multi-membership), plus a trailing "No label" bucket for the
 * unlabeled. Buckets follow the registry order; within a bucket, tasks sort by
 * due date then title. Empty buckets drop. Pure + total. */
export function groupByLabel(tasks: TaskRecord[], labels: LabelRecord[]): TaskBucket[] {
  const open = tasks.filter((t) => !isDone(t));
  const byId = new Map<string, TaskBucket>(
    labels.map((l) => [l.id, { key: l.id, label: l.name ?? 'Label', tasks: [] }]),
  );
  const none: TaskBucket = { key: '_none', label: 'No label', tasks: [] };
  for (const task of open) {
    const ids = (task.labelIds ?? []).filter((id): id is string => !!id && byId.has(id));
    if (ids.length === 0) none.tasks.push(task);
    else for (const id of ids) byId.get(id)!.tasks.push(task);
  }
  for (const b of [...byId.values(), none]) {
    b.tasks.sort(
      (a, b2) =>
        (a.dueDate ?? '9999').localeCompare(b2.dueDate ?? '9999') ||
        (a.title ?? '').localeCompare(b2.title ?? ''),
    );
  }
  return [...byId.values(), none].filter((b) => b.tasks.length > 0);
}
