import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchBoard, ensureDefaultSections, createTask, setTaskDone } = vi.hoisted(() => ({
  fetchBoard: vi.fn(),
  ensureDefaultSections: vi.fn(),
  createTask: vi.fn(),
  setTaskDone: vi.fn(),
}));
vi.mock('./boardApi', () => ({ fetchBoard, ensureDefaultSections }));
vi.mock('../task/tasksApi', () => ({ createTask, setTaskDone }));

import { hookWrapper } from '../../test/hookWrapper';
import { useBoard } from './useBoard';

beforeEach(() => {
  fetchBoard.mockReset();
  ensureDefaultSections.mockReset();
  createTask.mockReset();
  setTaskDone.mockReset();
});

describe('useBoard', () => {
  it('groups the loaded sections + tasks into columns', async () => {
    fetchBoard.mockResolvedValue({
      sections: [{ id: 's1', name: 'To do', sortOrder: 0 }],
      tasks: [],
    });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', name: 'To do', sortOrder: 0 }]);
    fetchBoard.mockResolvedValue({
      sections: [],
      tasks: [{ id: 't1', sectionId: 's1', sortOrder: 0 }],
    });
    const { result } = renderHook(() => useBoard('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.columns.length).toBe(1));
    expect(result.current.columns[0].tasks.map((t) => t.id)).toEqual(['t1']);
  });

  it('adds a task through the mutation', async () => {
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', name: 'To do', sortOrder: 0 }]);
    createTask.mockResolvedValue({ id: 'new' });
    const { result } = renderHook(() => useBoard('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    await act(async () => {
      await result.current.addTask.mutateAsync({ sectionId: 's1', title: 'X', order: 0 });
    });
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'p', title: 'X' }),
    );
  });
});
