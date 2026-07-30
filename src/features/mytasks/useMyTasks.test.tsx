import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks, setTaskDone, updateTask } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  setTaskDone: vi.fn(),
  updateTask: vi.fn(),
}));
vi.mock('./myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../task/tasksApi', () => ({ setTaskDone, updateTask }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'me@x.co' }) }));

import { hookWrapper } from '../../test/hookWrapper';
import { useMyTasks } from './useMyTasks';

beforeEach(() => {
  fetchMyTasks.mockReset();
  setTaskDone.mockReset();
  updateTask.mockReset();
  localStorage.clear();
});

describe('useMyTasks', () => {
  it('derives due buckets and the open total from the fetched tasks', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', status: 'TODO', dueDate: null, title: 'A', priority: 'HIGH' },
      { id: 'b', status: 'DONE', dueDate: null, title: 'B', priority: 'LOW' },
    ]);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.buckets.length).toBe(1));
    expect(result.current.buckets[0].key).toBe('noDate');
    expect(result.current.openTotal).toBe(1);
  });

  it('filters to my tasks when assigned-only is on (and persists it)', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', status: 'TODO', dueDate: null, priority: 'HIGH', assigneeEmail: 'me@x.co' },
      { id: 'b', status: 'TODO', dueDate: null, priority: 'LOW', assigneeEmail: 'other@x.co' },
    ]);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.openTotal).toBe(2));
    act(() => result.current.setAssignedOnly(true));
    expect(result.current.assignedOnly).toBe(true);
    expect(result.current.openTotal).toBe(1);
    expect(localStorage.getItem('tf-mytasks-assigned-only')).toBe('true');
  });

  it('regroups by priority when the mode switches (and persists it)', async () => {
    fetchMyTasks.mockResolvedValue([{ id: 'a', status: 'TODO', dueDate: null, priority: 'HIGH' }]);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.buckets.length).toBe(1));
    act(() => result.current.setGroupMode('priority'));
    expect(result.current.groupMode).toBe('priority');
    expect(result.current.buckets[0].key).toBe('HIGH');
    expect(localStorage.getItem('tf-mytasks-group')).toBe('priority');
  });

  it('toggles a task done', async () => {
    fetchMyTasks.mockResolvedValue([]);
    setTaskDone.mockResolvedValue(undefined);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.toggleDone.mutateAsync({ id: 'a', done: true, now: 'now' });
    });
    expect(setTaskDone).toHaveBeenCalledWith('a', true, 'now');
  });

  it('sets a task focus bucket via updateTask', async () => {
    fetchMyTasks.mockResolvedValue([]);
    updateTask.mockResolvedValue(undefined);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.setBucket.mutateAsync({ id: 'a', myBucket: 'TODAY' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 'a', myBucket: 'TODAY' });
  });

  it('appends a Completed bucket only when show-completed is on', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', status: 'TODO', dueDate: null, title: 'A' },
      { id: 'b', status: 'DONE', dueDate: null, title: 'B', completedAt: '2026-01-01' },
    ]);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.buckets.length).toBe(1));
    act(() => result.current.setShowCompleted(true));
    expect(result.current.showCompleted).toBe(true);
    expect(result.current.buckets.map((b) => b.key)).toContain('completed');
    expect(localStorage.getItem('tf-mytasks-show-completed')).toBe('true');
  });
});
