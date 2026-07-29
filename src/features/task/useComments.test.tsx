import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { addComment, deleteComment } = vi.hoisted(() => ({
  addComment: vi.fn(),
  deleteComment: vi.fn(),
}));
vi.mock('./taskDetailApi', () => ({ addComment, deleteComment }));

import { hookWrapper } from '../../test/hookWrapper';
import { useComments } from './useComments';

beforeEach(() => {
  addComment.mockReset();
  deleteComment.mockReset();
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
