import type { Column } from './taskGrouping';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import type { Priority } from '../task/taskMeta';
import type { ListGroup } from './listGrouping';

export const PRIORITY_ORDER: { key: Priority; name: string }[] = [
  { key: 'HIGH', name: 'High priority' },
  { key: 'MEDIUM', name: 'Medium priority' },
  { key: 'LOW', name: 'Low priority' },
  { key: 'NONE', name: 'No priority' },
];

export const DUE_ORDER = [
  { key: 'overdue', name: 'Overdue' },
  { key: 'today', name: 'Today' },
  { key: 'upcoming', name: 'Upcoming' },
  { key: 'noDate', name: 'No due date' },
];

/** Flatten a project's section columns back into a single task list. */
export function flatten(columns: Column[]): TaskRecord[] {
  return columns.flatMap((c) => c.tasks);
}

/** Bucket tasks by a keying function into the given ordered buckets, dropping
 * empties. Buckets not in `order` (e.g. unknown assignee) append after. */
export function bucketBy(
  tasks: TaskRecord[],
  keyOf: (t: TaskRecord) => { id: string; name: string },
  order: { key: string; name: string }[],
): ListGroup[] {
  const groups = new Map<string, ListGroup>();
  for (const o of order) groups.set(o.key, { id: o.key, name: o.name, tasks: [] });
  for (const task of tasks) {
    const { id, name } = keyOf(task);
    if (!groups.has(id)) groups.set(id, { id, name, tasks: [] });
    groups.get(id)!.tasks.push(task);
  }
  return [...groups.values()].filter((g) => g.tasks.length > 0);
}

/** Bucket tasks by their labels: a task appears under EVERY label it carries
 * (multi-membership), plus a trailing "No label" group for the unlabeled. Groups
 * follow the registry order; unknown label ids are ignored. */
export function bucketByLabel(tasks: TaskRecord[], labels: LabelRecord[]): ListGroup[] {
  const groups = new Map<string, ListGroup>(
    labels.map((l) => [l.id, { id: l.id, name: l.name ?? 'Label', tasks: [] }]),
  );
  const none: ListGroup = { id: '_none', name: 'No label', tasks: [] };
  for (const task of tasks) {
    const ids = (task.labelIds ?? []).filter((id): id is string => !!id && groups.has(id));
    if (ids.length === 0) none.tasks.push(task);
    else for (const id of ids) groups.get(id)!.tasks.push(task);
  }
  return [...groups.values(), none].filter((g) => g.tasks.length > 0);
}
