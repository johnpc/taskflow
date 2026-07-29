import { useMutation } from '@tanstack/react-query';
import { addComment, deleteComment, updateComment } from './taskDetailApi';

/** Comment mutations for a task — post a new comment (authored by the signed-in
 * user), edit one, and delete one — invalidating the shared detail query on
 * success. Split from useTaskDetail to keep that hub small (mirrors useAttachments). */
export function useComments(taskId: string, email: string | null, invalidate: () => void) {
  const add = useMutation({
    mutationFn: (body: string) => addComment({ taskId, body, authorEmail: email }),
    onSuccess: invalidate,
  });
  const edit = useMutation({
    mutationFn: (input: { id: string; body: string }) => updateComment(input.id, input.body),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: invalidate,
  });
  return { add, edit, remove };
}
