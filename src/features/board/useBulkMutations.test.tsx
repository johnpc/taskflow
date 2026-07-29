import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { setTaskDone, updateTask, deleteTask } = vi.hoisted(() => ({
  setTaskDone: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));
vi.mock('../task/tasksApi', () => ({ setTaskDone, updateTask, deleteTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useBulkMutations } from './useBulkMutations';

beforeEach(() => {
  setTaskDone.mockReset().mockResolvedValue(undefined);
  updateTask.mockReset().mockResolvedValue(undefined);
  deleteTask.mockReset().mockResolvedValue(undefined);
});

describe('useBulkMutations', () => {
  it('completes, moves, and deletes sets of ids', async () => {
    const invalidate = vi.fn();
    const { result } = renderHook(() => useBulkMutations(invalidate), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.bulkComplete.mutateAsync({ ids: ['a', 'b'], now: 'now' });
    });
    expect(setTaskDone).toHaveBeenCalledWith('a', true, 'now');
    expect(setTaskDone).toHaveBeenCalledWith('b', true, 'now');

    await act(async () => {
      await result.current.bulkMove.mutateAsync({ ids: ['a', 'b'], sectionId: 's2' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 'a', sectionId: 's2' });
    expect(updateTask).toHaveBeenCalledWith({ id: 'b', sectionId: 's2' });

    await act(async () => {
      await result.current.bulkDelete.mutateAsync(['c']);
    });
    expect(deleteTask).toHaveBeenCalledWith('c');
    expect(invalidate).toHaveBeenCalled();
  });
});
