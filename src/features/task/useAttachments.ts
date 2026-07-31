import { useMutation } from '@tanstack/react-query';
import { addAttachment, addFileAttachment, removeAttachment } from './attachmentsApi';
import { uploadAttachmentFile } from './attachmentFileApi';

/** Attachment mutations for a task, invalidating the shared detail query on
 * success. Handles both LINK attachments and uploaded FILES. Split from
 * useTaskDetail to keep that hub small. */
export function useAttachments(taskId: string, invalidate: () => void) {
  const add = useMutation({
    mutationFn: (input: { url: string; title: string }) => addAttachment({ taskId, ...input }),
    onSuccess: invalidate,
  });
  const addFile = useMutation({
    mutationFn: async (file: File) => {
      const storageKey = await uploadAttachmentFile(taskId, file);
      await addFileAttachment({ taskId, storageKey, title: file.name });
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeAttachment(id),
    onSuccess: invalidate,
  });
  return { add, addFile, remove };
}
