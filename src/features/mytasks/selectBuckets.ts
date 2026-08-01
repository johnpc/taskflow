import type { TaskRecord } from '../../lib/dataClient';
import { groupByDue, type TaskBucket } from './groupByDue';
import { groupByPriority } from './groupByPriority';
import { groupByFocus } from './groupByFocus';
import { groupByProject } from './groupByProject';
import type { GroupMode } from './groupMode';

/** Pick the grouping strategy for My Tasks by mode. Pure so the hook stays thin
 * and the mode→buckets mapping is unit-testable in one place. `projectName`
 * resolves ids→names for the 'project' grouping (ignored by the others). */
export function selectBuckets(
  mode: GroupMode,
  tasks: TaskRecord[],
  today: string,
  projectName: (id: string) => string | undefined = () => undefined,
): TaskBucket[] {
  if (mode === 'priority') return groupByPriority(tasks);
  if (mode === 'focus') return groupByFocus(tasks);
  if (mode === 'project') return groupByProject(tasks, projectName);
  return groupByDue(tasks, today);
}
