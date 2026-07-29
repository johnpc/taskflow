import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchBoard, setTaskDone } = vi.hoisted(() => ({
  fetchBoard: vi.fn(),
  setTaskDone: vi.fn(),
}));
vi.mock('../board/boardApi', () => ({ fetchBoard }));
vi.mock('../task/tasksApi', () => ({ setTaskDone }));

import { hookWrapper } from '../../test/hookWrapper';
import { useCompleted } from './useCompleted';

beforeEach(() => {
  fetchBoard.mockReset();
  setTaskDone.mockReset();
});

describe('useCompleted', () => {
  it('lists done top-level tasks, most-recently-completed first', async () => {
    fetchBoard.mockResolvedValue({
      sections: [],
      tasks: [
        { id: 'a', status: 'DONE', completedAt: '2026-07-01', parentTaskId: null },
        { id: 'b', status: 'DONE', completedAt: '2026-07-05', parentTaskId: null },
        { id: 'open', status: 'TODO', parentTaskId: null },
        { id: 'sub', status: 'DONE', parentTaskId: 'a' },
      ],
    });
    const { result } = renderHook(() => useCompleted('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.done.length).toBe(2));
    expect(result.current.done.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('reopens a task', async () => {
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    setTaskDone.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCompleted('p'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.reopen.mutateAsync({ id: 'x', now: 'now' });
    });
    expect(setTaskDone).toHaveBeenCalledWith('x', false, 'now');
  });
});
