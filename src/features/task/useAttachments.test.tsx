import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { addAttachment, removeAttachment } = vi.hoisted(() => ({
  addAttachment: vi.fn(),
  removeAttachment: vi.fn(),
}));
vi.mock('./attachmentsApi', () => ({ addAttachment, removeAttachment }));

import { hookWrapper } from '../../test/hookWrapper';
import { useAttachments } from './useAttachments';

beforeEach(() => {
  addAttachment.mockReset();
  removeAttachment.mockReset();
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

  it('removes an attachment by id', async () => {
    removeAttachment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAttachments('t', vi.fn()), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.remove.mutateAsync('a1');
    });
    expect(removeAttachment).toHaveBeenCalledWith('a1');
  });
});
