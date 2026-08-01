import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { setTaskDone, updateTask } = vi.hoisted(() => ({
  setTaskDone: vi.fn(),
  updateTask: vi.fn(),
}));
vi.mock('../task/tasksApi', () => ({ setTaskDone, updateTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useMyTasksMutations } from './useMyTasksMutations';

beforeEach(() => {
  setTaskDone.mockReset().mockResolvedValue(undefined);
  updateTask.mockReset().mockResolvedValue(undefined);
});

describe('useMyTasksMutations', () => {
  it('completes a task and re-files it into a focus bucket', async () => {
    const { result } = renderHook(() => useMyTasksMutations(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.toggleDone.mutateAsync({ id: 't1', done: true, now: 'now' });
    });
    expect(setTaskDone).toHaveBeenCalledWith('t1', true, 'now');

    await act(async () => {
      await result.current.setBucket.mutateAsync({ id: 't1', myBucket: 'TODAY' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 't1', myBucket: 'TODAY' });
  });
});
