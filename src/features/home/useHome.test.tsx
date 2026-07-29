import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchMyTasks, fetchProjects, todayISO } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  fetchProjects: vi.fn(),
  todayISO: vi.fn(),
}));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../projects/projectsApi', () => ({ fetchProjects }));
vi.mock('../task/today', () => ({ todayISO }));

import { hookWrapper } from '../../test/hookWrapper';
import { useHome } from './useHome';

beforeEach(() => {
  fetchMyTasks.mockReset();
  fetchProjects.mockReset();
  todayISO.mockReturnValue('2026-07-30');
});

describe('useHome', () => {
  it('summarizes tasks and exposes projects', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', status: 'TODO', dueDate: '2026-07-30', title: 'A' },
    ]);
    fetchProjects.mockResolvedValue([{ id: 'p', name: 'Launch' }]);
    const { result } = renderHook(() => useHome(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.summary.today.length).toBe(1));
    await waitFor(() => expect(result.current.projects.data).toHaveLength(1));
  });
});
