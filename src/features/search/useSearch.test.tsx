import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks, fetchLabels } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  fetchLabels: vi.fn(),
}));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../labels/labelsApi', () => ({ fetchLabels }));

import { hookWrapper } from '../../test/hookWrapper';
import { useSearch } from './useSearch';

beforeEach(() => {
  fetchMyTasks.mockReset();
  fetchLabels.mockReset().mockResolvedValue([]);
});

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

  it('narrows matches by the priority + completed filters', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'Ship it', notes: null, priority: 'HIGH', status: 'TODO' },
      { id: 'b', title: 'Ship logs', notes: null, priority: 'LOW', status: 'TODO' },
      { id: 'c', title: 'Ship done', notes: null, priority: 'HIGH', status: 'DONE' },
    ]);
    const { result } = renderHook(() => useSearch(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.tasksQuery.data).toHaveLength(3));
    act(() => result.current.setQuery('ship'));
    await waitFor(() => expect(result.current.results).toHaveLength(3));
    act(() => result.current.setFilters({ priority: 'HIGH', projectId: '', hideDone: true }));
    await waitFor(() => expect(result.current.results.map((t) => t.id)).toEqual(['a']));
  });

  it('matches a task by its label name', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'Fix login', notes: null, labelIds: ['l1'] },
      { id: 'b', title: 'Write copy', notes: null, labelIds: ['l2'] },
    ]);
    fetchLabels.mockResolvedValue([
      { id: 'l1', name: 'Backend' },
      { id: 'l2', name: 'Marketing' },
    ]);
    const { result } = renderHook(() => useSearch(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.tasksQuery.data).toHaveLength(2));
    act(() => result.current.setQuery('backend'));
    await waitFor(() => expect(result.current.results.map((t) => t.id)).toEqual(['a']));
  });
});
