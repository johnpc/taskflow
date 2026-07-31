import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadCover, coverUrl } from './coverApi';
import { updateTask } from './tasksApi';
import type { TaskRecord } from '../../lib/dataClient';

/** A task's cover image: resolves the stored key to a signed URL and uploads a
 * new cover (to shared storage, then persists the key on the task). Invalidates
 * the board + task queries so the card + detail re-render. */
export function useTaskCover(task: Pick<TaskRecord, 'id' | 'coverKey'>) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['cover', task.coverKey],
    queryFn: () => coverUrl(task.coverKey),
    enabled: !!task.coverKey,
    staleTime: 5 * 60_000,
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const key = await uploadCover(task.id, file);
      await updateTask({ id: task.id, coverKey: key });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board'] });
      qc.invalidateQueries({ queryKey: ['task', task.id] });
    },
  });

  return { url: query.data ?? null, upload };
}
