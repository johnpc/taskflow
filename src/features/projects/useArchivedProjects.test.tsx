import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchArchivedProjects, unarchiveProject } = vi.hoisted(() => ({
  fetchArchivedProjects: vi.fn(),
  unarchiveProject: vi.fn(),
}));
vi.mock('./archivedApi', () => ({ fetchArchivedProjects, unarchiveProject }));

import { hookWrapper } from '../../test/hookWrapper';
import { useArchivedProjects, useUnarchiveProject } from './useArchivedProjects';

beforeEach(() => {
  fetchArchivedProjects.mockReset();
  unarchiveProject.mockReset();
});

describe('useArchivedProjects', () => {
  it('loads the archived projects', async () => {
    fetchArchivedProjects.mockResolvedValue([{ id: 'a', name: 'A' }]);
    const { result } = renderHook(() => useArchivedProjects(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data).toHaveLength(1));
  });

  it('restores a project by id', async () => {
    unarchiveProject.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUnarchiveProject(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync('a');
    });
    expect(unarchiveProject).toHaveBeenCalledWith('a');
  });
});
