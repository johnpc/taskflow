import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';
import type { TaskBucket } from './groupByDue';

/** Group the owner's OPEN tasks by project, one bucket per project (named via
 * the resolver; unknown ids fall back to "Other"). Buckets sort alphabetically
 * by name; within a bucket, tasks sort by due date then title. Empty buckets
 * drop. Pure + total given the name resolver. */
export function groupByProject(
  tasks: TaskRecord[],
  projectName: (id: string) => string | undefined,
): TaskBucket[] {
  const open = tasks.filter((t) => !isDone(t));
  const byName = new Map<string, TaskRecord[]>();
  for (const task of open) {
    const name = projectName(task.projectId) ?? 'Other';
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name)!.push(task);
  }
  return [...byName.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, list]) => ({
      key: name,
      label: name,
      tasks: list.sort(
        (a, b) =>
          (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') ||
          (a.title ?? '').localeCompare(b.title ?? ''),
      ),
    }));
}
