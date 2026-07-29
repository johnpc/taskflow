import { useMutation } from '@tanstack/react-query';
import { addComment, deleteComment } from './taskDetailApi';

/** Comment mutations for a task — post a new comment (authored by the signed-in
 * user) and delete one — invalidating the shared detail query on success. Split
 * from useTaskDetail to keep that hub small (mirrors useAttachments). */
export function useComments(taskId: string, email: string | null, invalidate: () => void) {
  const add = useMutation({
    mutationFn: (body: string) => addComment({ taskId, body, authorEmail: email }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: invalidate,
  });
  return { add, remove };
}
