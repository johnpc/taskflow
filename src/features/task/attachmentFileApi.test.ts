import { describe, it, expect, vi, beforeEach } from 'vitest';

const { uploadData, getUrl } = vi.hoisted(() => ({ uploadData: vi.fn(), getUrl: vi.fn() }));
vi.mock('aws-amplify/storage', () => ({ uploadData, getUrl }));

import { uploadAttachmentFile, attachmentFileUrl } from './attachmentFileApi';

beforeEach(() => {
  uploadData.mockReset();
  getUrl.mockReset();
});

describe('attachmentFileApi', () => {
  it('uploads under the task folder, sanitizing the filename', async () => {
    uploadData.mockReturnValue({ result: Promise.resolve({ path: 'attachments/t1/my_file.pdf' }) });
    const file = new File(['x'], 'my file.pdf', { type: 'application/pdf' });
    expect(await uploadAttachmentFile('t1', file)).toBe('attachments/t1/my_file.pdf');
    expect(uploadData.mock.calls[0][0].path).toBe('attachments/t1/my_file.pdf');
  });

  it('resolves a stored key to a signed URL, null when unset', async () => {
    getUrl.mockResolvedValue({ url: new URL('https://s3/file') });
    expect(await attachmentFileUrl('attachments/t1/x.pdf')).toBe('https://s3/file');
    expect(await attachmentFileUrl(null)).toBeNull();
  });
});
