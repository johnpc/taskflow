import { useQuery } from '@tanstack/react-query';
import { dataClient, type TaskRecord } from '../../lib/dataClient';

/** The parent task of a subtask (for the "‹ Parent" breadcrumb), fetched by id.
 * Enabled only when parentId is set; returns null for a top-level task. */
export function useParentTask(parentId: string | null | undefined) {
  return useQuery({
    queryKey: ['task-parent', parentId],
    queryFn: async () => {
      const { data } = await dataClient.models.Task.get({ id: parentId! });
      return (data ?? null) as TaskRecord | null;
    },
    enabled: !!parentId,
  });
}
