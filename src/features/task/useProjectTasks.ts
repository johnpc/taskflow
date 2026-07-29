import { useQuery } from '@tanstack/react-query';
import { dataClient, type TaskRecord } from '../../lib/dataClient';

/** All tasks in a project — for the "blocked by" picker and resolving a task's
 * blockers to their current done state. One bounded GSI read, enabled once the
 * projectId is known. */
export function useProjectTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data } = await dataClient.models.Task.listTaskByProjectIdAndSortOrder(
        { projectId: projectId! },
        { limit: 1000 },
      );
      return (data ?? []).filter(Boolean) as TaskRecord[];
    },
    enabled: !!projectId,
  });
}
