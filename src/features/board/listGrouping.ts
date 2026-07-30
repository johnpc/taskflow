import type { Column } from './taskGrouping';
import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, type Priority } from '../task/taskMeta';

/** How the List view buckets its rows. SECTION is the model's own columns; the
 * rest dynamically re-bucket the flattened tasks (Asana-style group-by). */
export type GroupBy = 'SECTION' | 'ASSIGNEE' | 'DUE' | 'PRIORITY';

export const GROUP_BY_LABELS: Record<GroupBy, string> = {
  SECTION: 'Section',
  ASSIGNEE: 'Assignee',
  DUE: 'Due date',
  PRIORITY: 'Priority',
};

/** A named, id-keyed group of tasks rendered as one collapsible List section.
 * `id` seeds the collapse key; `name` is the header label. */
export interface ListGroup {
  id: string;
  name: string;
  tasks: TaskRecord[];
}

const PRIORITY_ORDER: { key: Priority; name: string }[] = [
  { key: 'HIGH', name: 'High priority' },
  { key: 'MEDIUM', name: 'Medium priority' },
  { key: 'LOW', name: 'Low priority' },
  { key: 'NONE', name: 'No priority' },
];

const DUE_ORDER = [
  { key: 'overdue', name: 'Overdue' },
  { key: 'today', name: 'Today' },
  { key: 'upcoming', name: 'Upcoming' },
  { key: 'noDate', name: 'No due date' },
];

/** Flatten a project's section columns back into a single task list. */
function flatten(columns: Column[]): TaskRecord[] {
  return columns.flatMap((c) => c.tasks);
}

/** Bucket tasks by a keying function into the given ordered buckets, dropping
 * empties. Buckets not in `order` (e.g. unknown assignee) append after. */
function bucketBy(
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

/** Regroup the section columns by the chosen field. SECTION returns the columns
 * as-is (id = section id). Pure; `today` is injected for the DUE buckets. */
export function groupListBy(columns: Column[], by: GroupBy, today: string): ListGroup[] {
  if (by === 'SECTION') {
    return columns.map((c) => ({ id: c.section.id, name: c.section.name, tasks: c.tasks }));
  }
  const tasks = flatten(columns);
  if (by === 'PRIORITY') {
    return bucketBy(
      tasks,
      (t) => {
        const p = (t.priority ?? 'NONE') as Priority;
        return { id: p, name: PRIORITY_ORDER.find((o) => o.key === p)!.name };
      },
      PRIORITY_ORDER,
    );
  }
  if (by === 'DUE') {
    return bucketBy(
      tasks,
      (t) => {
        const s = dueStatus(t.dueDate, today, false);
        const key = s === 'none' ? 'noDate' : s;
        return { id: key, name: DUE_ORDER.find((o) => o.key === key)!.name };
      },
      DUE_ORDER,
    );
  }
  // ASSIGNEE
  return bucketBy(
    tasks,
    (t) => ({ id: t.assigneeEmail ?? '_none', name: t.assigneeEmail ?? 'Unassigned' }),
    [{ key: '_none', name: 'Unassigned' }],
  );
}
