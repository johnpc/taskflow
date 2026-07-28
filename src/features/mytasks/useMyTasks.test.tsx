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
});

describe('useMyTasks', () => {
  it('derives due buckets from the fetched tasks', async () => {
    fetchMyTasks.mockResolvedValue([{ id: 'a', status: 'TODO', dueDate: null, title: 'A' }]);
    const { result } = renderHook(() => useMyTasks(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.buckets.length).toBe(1));
    expect(result.current.buckets[0].key).toBe('noDate');
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
