/**
 * Task cover-image storage I/O: upload a cover to the shared `covers/` folder
 * and resolve a stored key to a signed URL. Thin wrapper over Amplify Storage.
 */
import { uploadData, getUrl } from 'aws-amplify/storage';

/** Upload a cover image for a task; returns its S3 key (persisted on the task).
 * Keyed by task id so replacing a task's cover overwrites the same object. */
export async function uploadCover(taskId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const result = await uploadData({
    path: `covers/${taskId}.${ext}`,
    data: file,
    options: { contentType: file.type || 'image/jpeg' },
  }).result;
  return result.path;
}

/** Resolve a stored cover key to a temporary signed URL, or null if unset. */
export async function coverUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;
  const { url } = await getUrl({ path: key });
  return url.toString();
}
