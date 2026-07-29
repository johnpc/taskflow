import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { addComment, deleteComment, updateComment } = vi.hoisted(() => ({
  addComment: vi.fn(),
  deleteComment: vi.fn(),
  updateComment: vi.fn(),
}));
vi.mock('./taskDetailApi', () => ({ addComment, deleteComment, updateComment }));

import { hookWrapper } from '../../test/hookWrapper';
import { useComments } from './useComments';

beforeEach(() => {
  addComment.mockReset();
  deleteComment.mockReset();
  updateComment.mockReset();
});

describe('useComments', () => {
  it('posts a comment with the task + author, invalidating', async () => {
    addComment.mockResolvedValue({ id: 'c' });
    const invalidate = vi.fn();
    const { result } = renderHook(() => useComments('t', 'me@x.co', invalidate), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.add.mutateAsync('nice');
    });
    expect(addComment).toHaveBeenCalledWith({ taskId: 't', body: 'nice', authorEmail: 'me@x.co' });
    expect(invalidate).toHaveBeenCalled();
  });

  it('edits a comment body', async () => {
    updateComment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useComments('t', null, vi.fn()), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.edit.mutateAsync({ id: 'c1', body: 'new' });
    });
    expect(updateComment).toHaveBeenCalledWith('c1', 'new');
  });

  it('deletes a comment by id', async () => {
    deleteComment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useComments('t', null, vi.fn()), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.remove.mutateAsync('c1');
    });
    expect(deleteComment).toHaveBeenCalledWith('c1');
  });
});
