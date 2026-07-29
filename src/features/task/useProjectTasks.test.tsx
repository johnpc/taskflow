import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { listTasks } = vi.hoisted(() => ({ listTasks: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { listTaskByProjectIdAndSortOrder: listTasks } } },
}));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectTasks } from './useProjectTasks';

beforeEach(() => listTasks.mockReset());

describe('useProjectTasks', () => {
  it('fetches the project tasks and drops nulls', async () => {
    listTasks.mockResolvedValue({ data: [{ id: 't1' }, null] });
    const { result } = renderHook(() => useProjectTasks('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 't1' }]));
  });

  it('is disabled with no projectId', () => {
    const { result } = renderHook(() => useProjectTasks(undefined), { wrapper: hookWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(listTasks).not.toHaveBeenCalled();
  });
});
