import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchBoard, ensureDefaultSections, createTask, setTaskDone, updateTask, deleteTask } =
  vi.hoisted(() => ({
    fetchBoard: vi.fn(),
    ensureDefaultSections: vi.fn(),
    createTask: vi.fn(),
    setTaskDone: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }));
vi.mock('./boardApi', () => ({ fetchBoard, ensureDefaultSections }));
vi.mock('../task/tasksApi', () => ({ createTask, setTaskDone, updateTask, deleteTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useBoard } from './useBoard';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => {
  fetchBoard.mockReset();
  ensureDefaultSections.mockReset();
  createTask.mockReset();
  setTaskDone.mockReset();
  updateTask.mockReset();
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

  it('reorders a task by patching the two swapped sortOrders', async () => {
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', name: 'To do', sortOrder: 0 }]);
    updateTask.mockResolvedValue(undefined);
    const columnTasks = [
      { id: 'a', sortOrder: 0 },
      { id: 'b', sortOrder: 1 },
    ] as TaskRecord[];
    const { result } = renderHook(() => useBoard('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    await act(async () => {
      await result.current.reorder.mutateAsync({ columnTasks, taskId: 'b', direction: 'up' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 'b', sortOrder: 0 });
    expect(updateTask).toHaveBeenCalledWith({ id: 'a', sortOrder: 1 });
  });

  it('quick-edits a task field', async () => {
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', name: 'To do', sortOrder: 0 }]);
    updateTask.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBoard('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    await act(async () => {
      await result.current.quickEdit.mutateAsync({ id: 't', priority: 'HIGH' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 't', priority: 'HIGH' });
  });

  it('bulk-completes and bulk-deletes selected ids', async () => {
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', name: 'To do', sortOrder: 0 }]);
    setTaskDone.mockResolvedValue(undefined);
    deleteTask.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBoard('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    await act(async () => {
      await result.current.bulkComplete.mutateAsync({ ids: ['a', 'b'], now: 'now' });
      await result.current.bulkDelete.mutateAsync(['c']);
    });
    expect(setTaskDone).toHaveBeenCalledWith('a', true, 'now');
    expect(setTaskDone).toHaveBeenCalledWith('b', true, 'now');
    expect(deleteTask).toHaveBeenCalledWith('c');
  });
});
