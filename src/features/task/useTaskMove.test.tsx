import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchProjects, fetchBoard, ensureDefaultSections, updateTask } = vi.hoisted(() => ({
  fetchProjects: vi.fn(),
  fetchBoard: vi.fn(),
  ensureDefaultSections: vi.fn(),
  updateTask: vi.fn(),
}));
vi.mock('../projects/projectsApi', () => ({ fetchProjects }));
vi.mock('../board/boardApi', () => ({ fetchBoard, ensureDefaultSections }));
vi.mock('./tasksApi', () => ({ updateTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useTaskMove } from './useTaskMove';

beforeEach(() => {
  fetchProjects.mockReset();
  fetchBoard.mockReset();
  ensureDefaultSections.mockReset();
  updateTask.mockReset();
});

describe('useTaskMove', () => {
  it('exposes the projects list', async () => {
    fetchProjects.mockResolvedValue([{ id: 'p1', name: 'A' }]);
    const { result } = renderHook(() => useTaskMove(vi.fn()), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.projects.data).toHaveLength(1));
  });

  it('moves a task into the target project first section, invalidating', async () => {
    fetchProjects.mockResolvedValue([]);
    fetchBoard.mockResolvedValue({ sections: [], tasks: [] });
    ensureDefaultSections.mockResolvedValue([{ id: 's1', sortOrder: 0, projectId: 'p2' }]);
    updateTask.mockResolvedValue(undefined);
    const invalidate = vi.fn();
    const { result } = renderHook(() => useTaskMove(invalidate), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.move.mutateAsync({ taskId: 't', projectId: 'p2' });
    });
    expect(updateTask).toHaveBeenCalledWith({
      id: 't',
      projectId: 'p2',
      sectionId: 's1',
      blockedByIds: [],
    });
    expect(invalidate).toHaveBeenCalled();
  });
});
