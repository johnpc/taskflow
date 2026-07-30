import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { archiveProject, deleteProject, duplicateProject, fetchProjects } = vi.hoisted(() => ({
  archiveProject: vi.fn(),
  deleteProject: vi.fn(),
  duplicateProject: vi.fn(),
  fetchProjects: vi.fn(),
}));
vi.mock('../projects/projectsApi', () => ({ archiveProject, deleteProject, fetchProjects }));
vi.mock('../projects/duplicateProjectApi', () => ({ duplicateProject }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectActions } from './useProjectActions';
import type { ProjectRecord } from '../../lib/dataClient';

beforeEach(() => {
  archiveProject.mockReset();
  deleteProject.mockReset();
  duplicateProject.mockReset();
  fetchProjects.mockResolvedValue([]);
});

describe('useProjectActions', () => {
  it('archives the project', async () => {
    archiveProject.mockResolvedValue(undefined);
    const { result } = renderHook(() => useProjectActions('p'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.archive.mutateAsync();
    });
    expect(archiveProject).toHaveBeenCalledWith('p');
  });

  it('deletes the project', async () => {
    deleteProject.mockResolvedValue(undefined);
    const { result } = renderHook(() => useProjectActions('p'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.remove.mutateAsync();
    });
    expect(deleteProject).toHaveBeenCalledWith('p');
  });

  it('duplicates the project from the source record', async () => {
    duplicateProject.mockResolvedValue({ id: 'p2' });
    const source = { id: 'p', name: 'Launch' } as ProjectRecord;
    const { result } = renderHook(() => useProjectActions('p'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.duplicate.mutateAsync(source);
    });
    expect(duplicateProject).toHaveBeenCalledWith(source, expect.any(Number));
  });
});
