import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchMyTasks } = vi.hoisted(() => ({ fetchMyTasks: vi.fn() }));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectCounts } from './useProjectCounts';

beforeEach(() => fetchMyTasks.mockReset());

describe('useProjectCounts', () => {
  it('derives open counts per project', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', projectId: 'p1', status: 'TODO' },
      { id: 'b', projectId: 'p1', status: 'TODO' },
    ]);
    const { result } = renderHook(() => useProjectCounts(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.get('p1')).toBe(2));
  });
});
