import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const {
  fetchTaskDetail,
  addComment,
  deleteComment,
  createTask,
  setTaskDone,
  updateTask,
  deleteTask,
  duplicateTask,
} = vi.hoisted(() => ({
  fetchTaskDetail: vi.fn(),
  addComment: vi.fn(),
  deleteComment: vi.fn(),
  createTask: vi.fn(),
  setTaskDone: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  duplicateTask: vi.fn(),
}));
vi.mock('./taskDetailApi', () => ({
  fetchTaskDetail,
  addComment,
  deleteComment,
  updateComment: vi.fn(),
}));
vi.mock('./tasksApi', () => ({ createTask, setTaskDone, updateTask, deleteTask, duplicateTask }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'me@x.co' }) }));

import { hookWrapper } from '../../test/hookWrapper';
import { useTaskDetail } from './useTaskDetail';

beforeEach(() => {
  fetchTaskDetail.mockReset();
  addComment.mockReset();
  createTask.mockReset();
  setTaskDone.mockReset();
  updateTask.mockReset();
});

describe('useTaskDetail', () => {
  it('loads the task detail', async () => {
    fetchTaskDetail.mockResolvedValue({
      task: { id: 't', title: 'T' },
      subtasks: [],
      comments: [],
    });
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.data?.task?.id).toBe('t'));
  });

  it('posts a comment with the signed-in email', async () => {
    fetchTaskDetail.mockResolvedValue({ task: { id: 't' }, subtasks: [], comments: [] });
    addComment.mockResolvedValue({ id: 'c' });
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.comments.add.mutateAsync('nice');
    });
    expect(addComment).toHaveBeenCalledWith({ taskId: 't', body: 'nice', authorEmail: 'me@x.co' });
  });

  it('patches fields', async () => {
    fetchTaskDetail.mockResolvedValue({ task: { id: 't' }, subtasks: [], comments: [] });
    updateTask.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.patch.mutateAsync({ id: 't', title: 'New' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 't', title: 'New' });
  });

  it('adds a subtask under the current task', async () => {
    fetchTaskDetail.mockResolvedValue({ task: { id: 't' }, subtasks: [], comments: [] });
    createTask.mockResolvedValue({ id: 'sub' });
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.addSubtask.mutateAsync({ projectId: 'p', title: 'Sub', order: 0 });
    });
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'p', title: 'Sub', parentTaskId: 't' }),
    );
  });

  it('toggles a task done + deletes', async () => {
    fetchTaskDetail.mockResolvedValue({ task: { id: 't' }, subtasks: [], comments: [] });
    setTaskDone.mockResolvedValue(undefined);
    deleteTask.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.toggleDone.mutateAsync({ taskId: 't', done: true, now: 'now' });
      await result.current.remove.mutateAsync('t');
    });
    expect(setTaskDone).toHaveBeenCalledWith('t', true, 'now');
    expect(deleteTask).toHaveBeenCalledWith('t');
  });

  it('duplicates a task at sortOrder + 1', async () => {
    fetchTaskDetail.mockResolvedValue({ task: { id: 't' }, subtasks: [], comments: [] });
    duplicateTask.mockResolvedValue({ id: 'copy' });
    const { result } = renderHook(() => useTaskDetail('t'), { wrapper: hookWrapper() });
    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.duplicate.mutateAsync({ id: 't', sortOrder: 2 } as any);
    });
    expect(duplicateTask).toHaveBeenCalledWith(expect.objectContaining({ id: 't' }), 3);
  });
});
