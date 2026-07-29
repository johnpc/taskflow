import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { listTasks } = vi.hoisted(() => ({ listTasks: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { listTaskByProjectIdAndSortOrder: listTasks } } },
}));

import { hookWrapper } from '../../test/hookWrapper';
import { useTaskBlocked } from './useTaskBlocked';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', projectId: 'p', status: 'TODO', ...over }) as TaskRecord;

beforeEach(() => listTasks.mockReset());

describe('useTaskBlocked', () => {
  it('is true when a blocker is not done', async () => {
    listTasks.mockResolvedValue({ data: [task({ id: 'b', status: 'TODO' })] });
    const t = task({ blockedByIds: ['b'] });
    const { result } = renderHook(() => useTaskBlocked(t), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('is false once every blocker is done', async () => {
    listTasks.mockResolvedValue({ data: [task({ id: 'b', status: 'DONE' })] });
    const t = task({ blockedByIds: ['b'] });
    const { result } = renderHook(() => useTaskBlocked(t), { wrapper: hookWrapper() });
    await waitFor(() => expect(listTasks).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });
});
