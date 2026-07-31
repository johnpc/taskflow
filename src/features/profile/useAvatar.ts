import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveAvatarKey } from './userProfileApi';
import { uploadAvatar, avatarUrl } from './avatarApi';
import { useAuth } from '../auth/useAuth';

/** The signed-in user's avatar: resolves the stored key to a signed URL and
 * uploads a new image (to their identity-scoped S3 folder, then persists the
 * key on their profile). Server state via react-query so the profile cache is
 * shared with the display-name hook. */
export function useAvatar() {
  const { email } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['avatar', email],
    queryFn: async () => {
      const profile = await fetchProfile(email!);
      return avatarUrl(profile?.avatarKey);
    },
    enabled: !!email,
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const key = await uploadAvatar(file);
      await saveAvatarKey(email!, key);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['avatar', email] });
      qc.invalidateQueries({ queryKey: ['profile', email] });
    },
  });

  return { url: query.data ?? null, upload };
}
