import { describe, it, expect, vi, beforeEach } from 'vitest';

const { uploadData, getUrl } = vi.hoisted(() => ({ uploadData: vi.fn(), getUrl: vi.fn() }));
vi.mock('aws-amplify/storage', () => ({ uploadData, getUrl }));

import { uploadAvatar, avatarUrl } from './avatarApi';

beforeEach(() => {
  uploadData.mockReset();
  getUrl.mockReset();
});

describe('avatarApi', () => {
  it('uploads to an identity-scoped path and returns the resolved key', async () => {
    uploadData.mockReturnValue({ result: Promise.resolve({ path: 'avatars/id1/avatar.png' }) });
    const file = new File(['x'], 'me.png', { type: 'image/png' });
    const key = await uploadAvatar(file);
    expect(key).toBe('avatars/id1/avatar.png');
    // The path is a function resolving the identity id + preserving the extension.
    const arg = uploadData.mock.calls[0][0];
    expect(arg.path({ identityId: 'id1' })).toBe('avatars/id1/avatar.png');
  });

  it('resolves a stored key to a signed URL', async () => {
    getUrl.mockResolvedValue({ url: new URL('https://s3/signed') });
    expect(await avatarUrl('avatars/id1/avatar.png')).toBe('https://s3/signed');
  });

  it('returns null for no key without hitting storage', async () => {
    expect(await avatarUrl(null)).toBeNull();
    expect(getUrl).not.toHaveBeenCalled();
  });
});
