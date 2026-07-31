/**
 * Uploaded-file attachment storage I/O: put a file under a task's `attachments/`
 * folder and resolve a stored key to a signed URL. Thin wrapper over Amplify
 * Storage (keeps the SDK mockable in one place).
 */
import { uploadData, getUrl } from 'aws-amplify/storage';

/** Upload a file attachment for a task; returns its S3 key. Namespaced by task
 * id, and by the filename so multiple files on a task don't collide. */
export async function uploadAttachmentFile(taskId: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
  const result = await uploadData({
    path: `attachments/${taskId}/${safeName}`,
    data: file,
    options: { contentType: file.type || 'application/octet-stream' },
  }).result;
  return result.path;
}

/** Resolve a stored attachment key to a temporary signed URL, or null if unset. */
export async function attachmentFileUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;
  const { url } = await getUrl({ path: key });
  return url.toString();
}
