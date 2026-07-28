import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks } = vi.hoisted(() => ({ fetchMyTasks: vi.fn() }));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));

import { hookWrapper } from '../../test/hookWrapper';
import { useSearch } from './useSearch';

beforeEach(() => fetchMyTasks.mockReset());

describe('useSearch', () => {
  it('filters tasks by the live query', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'Design review', notes: null },
      { id: 'b', title: 'Standup', notes: null },
    ]);
    const { result } = renderHook(() => useSearch(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.tasksQuery.data).toHaveLength(2));
    expect(result.current.results).toEqual([]);
    act(() => result.current.setQuery('design'));
    await waitFor(() => expect(result.current.results.map((t) => t.id)).toEqual(['a']));
  });
});
