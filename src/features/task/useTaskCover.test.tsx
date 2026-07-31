import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const { uploadCover, coverUrl, updateTask } = vi.hoisted(() => ({
  uploadCover: vi.fn(),
  coverUrl: vi.fn(),
  updateTask: vi.fn(),
}));
vi.mock('./coverApi', () => ({ uploadCover, coverUrl }));
vi.mock('./tasksApi', () => ({ updateTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useTaskCover } from './useTaskCover';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => {
  uploadCover.mockReset();
  coverUrl.mockReset();
  updateTask.mockReset().mockResolvedValue(undefined);
});

describe('useTaskCover', () => {
  it('resolves the stored cover to a URL', async () => {
    coverUrl.mockResolvedValue('https://s3/cover');
    const { result } = renderHook(
      () => useTaskCover({ id: 't1', coverKey: 'covers/t1.png' } as TaskRecord),
      { wrapper: hookWrapper() },
    );
    await waitFor(() => expect(result.current.url).toBe('https://s3/cover'));
  });

  it('uploads a file then persists the key on the task', async () => {
    coverUrl.mockResolvedValue(null);
    uploadCover.mockResolvedValue('covers/t1.png');
    const { result } = renderHook(() => useTaskCover({ id: 't1', coverKey: null } as TaskRecord), {
      wrapper: hookWrapper(),
    });
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    await act(async () => {
      await result.current.upload.mutateAsync(file);
    });
    expect(uploadCover).toHaveBeenCalledWith('t1', file);
    expect(updateTask).toHaveBeenCalledWith({ id: 't1', coverKey: 'covers/t1.png' });
  });
});
