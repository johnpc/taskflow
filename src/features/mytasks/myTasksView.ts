import type { TaskRecord } from '../../lib/dataClient';
import { selectBuckets } from './selectBuckets';
import { completedBucket } from './completedBucket';
import { sortListRows, type ListSort } from '../board/listSort';
import type { GroupMode } from './groupMode';
import type { TaskBucket } from './groupByDue';

export interface MyTasksViewInput {
  tasks: TaskRecord[];
  mode: GroupMode;
  today: string;
  showCompleted: boolean;
  sort: ListSort;
  projectName?: (id: string) => string | undefined;
}

/** Build the My Tasks buckets: group by the chosen mode, optionally append a
 * Completed bucket, then apply the within-bucket sort to every bucket's rows
 * (manual keeps each grouping's own order). Pure so the hook stays thin and the
 * whole pipeline is unit-testable in one place. */
export function buildMyTasksBuckets(input: MyTasksViewInput): TaskBucket[] {
  const { tasks, mode, today, showCompleted, sort, projectName } = input;
  const open = selectBuckets(mode, tasks, today, projectName);
  const all = showCompleted ? [...open, ...completedBucket(tasks)] : open;
  return all.map((b) => ({ ...b, tasks: sortListRows(b.tasks, sort) }));
}
