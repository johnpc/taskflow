import { describe, it, expect, vi, beforeEach } from 'vitest';

const { uploadData, getUrl } = vi.hoisted(() => ({ uploadData: vi.fn(), getUrl: vi.fn() }));
vi.mock('aws-amplify/storage', () => ({ uploadData, getUrl }));

import { uploadCover, coverUrl } from './coverApi';

beforeEach(() => {
  uploadData.mockReset();
  getUrl.mockReset();
});

describe('coverApi', () => {
  it('uploads to a task-keyed covers path and returns the key', async () => {
    uploadData.mockReturnValue({ result: Promise.resolve({ path: 'covers/t1.png' }) });
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    expect(await uploadCover('t1', file)).toBe('covers/t1.png');
    expect(uploadData.mock.calls[0][0].path).toBe('covers/t1.png');
  });

  it('resolves a stored key to a signed URL, null when unset', async () => {
    getUrl.mockResolvedValue({ url: new URL('https://s3/cover') });
    expect(await coverUrl('covers/t1.png')).toBe('https://s3/cover');
    expect(await coverUrl(null)).toBeNull();
  });
});
