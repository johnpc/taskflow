import type { Column } from './taskGrouping';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import { dueStatus, type Priority } from '../task/taskMeta';
import { bucketBy, bucketByLabel, flatten, PRIORITY_ORDER, DUE_ORDER } from './listBuckets';

/** How the List view buckets its rows. NONE is a single flat list; SECTION is
 * the model's own columns; the rest dynamically re-bucket the flattened tasks
 * (Asana-style group-by). */
export type GroupBy = 'NONE' | 'SECTION' | 'ASSIGNEE' | 'DUE' | 'PRIORITY' | 'LABEL';

export const GROUP_BY_LABELS: Record<GroupBy, string> = {
  NONE: 'None',
  SECTION: 'Section',
  ASSIGNEE: 'Assignee',
  DUE: 'Due date',
  PRIORITY: 'Priority',
  LABEL: 'Label',
};

/** A named, id-keyed group of tasks rendered as one collapsible List section.
 * `id` seeds the collapse key; `name` is the header label. */
export interface ListGroup {
  id: string;
  name: string;
  tasks: TaskRecord[];
}

/** Regroup the section columns by the chosen field. SECTION returns the columns
 * as-is (id = section id). Pure; `today` is injected for the DUE buckets and
 * `labels` names the LABEL groups. */
export function groupListBy(
  columns: Column[],
  by: GroupBy,
  today: string,
  labels: LabelRecord[] = [],
): ListGroup[] {
  if (by === 'SECTION') {
    return columns.map((c) => ({ id: c.section.id, name: c.section.name, tasks: c.tasks }));
  }
  const tasks = flatten(columns);
  if (by === 'NONE') {
    return [{ id: '_all', name: 'All tasks', tasks }];
  }
  if (by === 'LABEL') {
    return bucketByLabel(tasks, labels);
  }
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
