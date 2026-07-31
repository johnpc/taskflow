import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { addAttachment, addFileAttachment, removeAttachment, uploadAttachmentFile } = vi.hoisted(
  () => ({
    addAttachment: vi.fn(),
    addFileAttachment: vi.fn(),
    removeAttachment: vi.fn(),
    uploadAttachmentFile: vi.fn(),
  }),
);
vi.mock('./attachmentsApi', () => ({ addAttachment, addFileAttachment, removeAttachment }));
vi.mock('./attachmentFileApi', () => ({ uploadAttachmentFile }));

import { hookWrapper } from '../../test/hookWrapper';
import { useAttachments } from './useAttachments';

beforeEach(() => {
  addAttachment.mockReset();
  addFileAttachment.mockReset().mockResolvedValue({ id: 'f' });
  removeAttachment.mockReset();
  uploadAttachmentFile.mockReset();
});

describe('useAttachments', () => {
  it('adds an attachment for the task and invalidates', async () => {
    addAttachment.mockResolvedValue({ id: 'x' });
    const invalidate = vi.fn();
    const { result } = renderHook(() => useAttachments('t', invalidate), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.add.mutateAsync({ url: 'https://x.co', title: 'T' });
    });
    expect(addAttachment).toHaveBeenCalledWith({ taskId: 't', url: 'https://x.co', title: 'T' });
    expect(invalidate).toHaveBeenCalled();
  });

  it('uploads a file then records it as a file attachment', async () => {
    uploadAttachmentFile.mockResolvedValue('attachments/t/doc.pdf');
    const { result } = renderHook(() => useAttachments('t', vi.fn()), { wrapper: hookWrapper() });
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    await act(async () => {
      await result.current.addFile.mutateAsync(file);
    });
    expect(uploadAttachmentFile).toHaveBeenCalledWith('t', file);
    expect(addFileAttachment).toHaveBeenCalledWith({
      taskId: 't',
      storageKey: 'attachments/t/doc.pdf',
      title: 'doc.pdf',
    });
  });

  it('removes an attachment by id', async () => {
    removeAttachment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAttachments('t', vi.fn()), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.remove.mutateAsync('a1');
    });
    expect(removeAttachment).toHaveBeenCalledWith('a1');
  });
});
