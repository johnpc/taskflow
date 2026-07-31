/**
 * Avatar storage I/O: upload the signed-in user's avatar image to their
 * identity-scoped S3 folder, and resolve a stored key to a signed URL. Thin
 * wrapper over Amplify Storage so the hook + tests mock one module.
 */
import { uploadData, getUrl } from 'aws-amplify/storage';

/** Upload an avatar image for the signed-in user; returns its S3 key (stored on
 * the profile so it can be resolved later). Keyed by the caller's identity id so
 * only they can write it. */
export async function uploadAvatar(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const result = await uploadData({
    path: ({ identityId }) => `avatars/${identityId}/avatar.${ext}`,
    data: file,
    options: { contentType: file.type || 'image/jpeg' },
  }).result;
  return result.path;
}

/** Resolve a stored avatar key to a temporary signed URL, or null if unset. */
export async function avatarUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;
  const { url } = await getUrl({ path: key });
  return url.toString();
}
