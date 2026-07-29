import { useMutation } from '@tanstack/react-query';
import { addAttachment, removeAttachment } from './attachmentsApi';

/** Attachment mutations for a task, invalidating the shared detail query on
 * success. Split from useTaskDetail to keep that hub small. */
export function useAttachments(taskId: string, invalidate: () => void) {
  const add = useMutation({
    mutationFn: (input: { url: string; title: string }) => addAttachment({ taskId, ...input }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeAttachment(id),
    onSuccess: invalidate,
  });
  return { add, remove };
}
