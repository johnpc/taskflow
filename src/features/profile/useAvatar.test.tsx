import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const { fetchProfile, saveAvatarKey, uploadAvatar, avatarUrl } = vi.hoisted(() => ({
  fetchProfile: vi.fn(),
  saveAvatarKey: vi.fn(),
  uploadAvatar: vi.fn(),
  avatarUrl: vi.fn(),
}));
vi.mock('./userProfileApi', () => ({ fetchProfile, saveAvatarKey }));
vi.mock('./avatarApi', () => ({ uploadAvatar, avatarUrl }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'a@x.co' }) }));

import { hookWrapper } from '../../test/hookWrapper';
import { useAvatar } from './useAvatar';

beforeEach(() => {
  fetchProfile.mockReset();
  saveAvatarKey.mockReset().mockResolvedValue(undefined);
  uploadAvatar.mockReset();
  avatarUrl.mockReset();
});

describe('useAvatar', () => {
  it('resolves the stored avatar to a URL', async () => {
    fetchProfile.mockResolvedValue({ email: 'a@x.co', avatarKey: 'avatars/x/a.png' });
    avatarUrl.mockResolvedValue('https://s3/signed');
    const { result } = renderHook(() => useAvatar(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.url).toBe('https://s3/signed'));
  });

  it('uploads a file then persists its key', async () => {
    fetchProfile.mockResolvedValue(null);
    avatarUrl.mockResolvedValue(null);
    uploadAvatar.mockResolvedValue('avatars/x/a.png');
    const { result } = renderHook(() => useAvatar(), { wrapper: hookWrapper() });
    const file = new File(['x'], 'me.png', { type: 'image/png' });
    await act(async () => {
      await result.current.upload.mutateAsync(file);
    });
    expect(uploadAvatar).toHaveBeenCalledWith(file);
    expect(saveAvatarKey).toHaveBeenCalledWith('a@x.co', 'avatars/x/a.png');
  });
});
