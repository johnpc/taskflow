import type { TaskRecord } from '../../lib/dataClient';
import { groupByDue, type TaskBucket } from './groupByDue';
import { groupByPriority } from './groupByPriority';
import { groupByFocus } from './groupByFocus';
import type { GroupMode } from './groupMode';

/** Pick the grouping strategy for My Tasks by mode. Pure so the hook stays thin
 * and the mode→buckets mapping is unit-testable in one place. */
export function selectBuckets(mode: GroupMode, tasks: TaskRecord[], today: string): TaskBucket[] {
  if (mode === 'priority') return groupByPriority(tasks);
  if (mode === 'focus') return groupByFocus(tasks);
  return groupByDue(tasks, today);
}
