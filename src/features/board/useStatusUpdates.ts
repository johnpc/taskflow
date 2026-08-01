import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStatusUpdates, postStatusUpdate } from '../projects/statusUpdatesApi';
import { useAuth } from '../auth/useAuth';
import type { ProjectStatus } from '../projects/projectStatus';

/** Status-update history for a project: the dated feed + a post mutation.
 * Posting sets the project's current status too, so it refreshes the project +
 * board queries alongside the feed. */
export function useStatusUpdates(projectId: string) {
  const qc = useQueryClient();
  const { email } = useAuth();
  const query = useQuery({
    queryKey: ['status-updates', projectId],
    queryFn: () => fetchStatusUpdates(projectId),
  });
  const post = useMutation({
    mutationFn: (input: { status: ProjectStatus; note: string }) =>
      postStatusUpdate({ projectId, status: input.status, note: input.note, authorEmail: email }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-updates', projectId] });
      qc.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
  return { query, post };
}
