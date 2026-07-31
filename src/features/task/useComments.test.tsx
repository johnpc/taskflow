import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { addComment, deleteComment, updateComment, setCommentLikes } = vi.hoisted(() => ({
  addComment: vi.fn(),
  deleteComment: vi.fn(),
  updateComment: vi.fn(),
  setCommentLikes: vi.fn(),
}));
vi.mock('./taskDetailApi', () => ({ addComment, deleteComment, updateComment, setCommentLikes }));

import { hookWrapper } from '../../test/hookWrapper';
import { useComments } from './useComments';
import type { CommentRecord } from '../../lib/dataClient';

beforeEach(() => {
  addComment.mockReset();
  deleteComment.mockReset();
  updateComment.mockReset();
  setCommentLikes.mockReset();
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

  it('likes a comment by toggling the current user into likedBy', async () => {
    setCommentLikes.mockResolvedValue(undefined);
    const { result } = renderHook(() => useComments('t', 'me@x.co', vi.fn()), {
      wrapper: hookWrapper(),
    });
    const comment = { id: 'c1', likedBy: ['you@x.co'] } as CommentRecord;
    await act(async () => {
      await result.current.like.mutateAsync(comment);
    });
    expect(setCommentLikes).toHaveBeenCalledWith('c1', ['you@x.co', 'me@x.co']);
  });
});
