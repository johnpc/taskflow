import { useProjectTasks } from './useProjectTasks';
import { isBlocked } from './dependencies';
import type { TaskRecord } from '../../lib/dataClient';

/** Whether a task currently has at least one not-done blocker. Reuses the
 * project-tasks query (shared react-query cache with the dependencies picker),
 * so it's free once the detail's "Blocked by" section has loaded. */
export function useTaskBlocked(task: TaskRecord): boolean {
  const { data } = useProjectTasks(task.projectId);
  return isBlocked(task, data ?? []);
}
