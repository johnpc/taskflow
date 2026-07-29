import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks, setTaskDone } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  setTaskDone: vi.fn(),
}));
vi.mock('./myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../task/tasksApi', () => ({ setTaskDone }));

import { hookWrapper } from '../../test/hookWrapper';
import { useMyTasks } from './useMyTasks';

beforeEach(() => {
  fetchMyTasks.mockReset();
  setTaskDone.mockReset();
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
});
