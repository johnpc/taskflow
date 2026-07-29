import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchMyTasks } = vi.hoisted(() => ({ fetchMyTasks: vi.fn() }));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectProgress } from './useProjectProgress';

beforeEach(() => fetchMyTasks.mockReset());

describe('useProjectProgress', () => {
  it('derives done/total per project from the shared fetch', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', projectId: 'p1', status: 'DONE' },
      { id: 'b', projectId: 'p1', status: 'TODO' },
    ]);
    const { result } = renderHook(() => useProjectProgress(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.get('p1')).toEqual({ done: 1, total: 2 }));
  });
});
