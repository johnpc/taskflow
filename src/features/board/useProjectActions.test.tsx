import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { archiveProject, deleteProject } = vi.hoisted(() => ({
  archiveProject: vi.fn(),
  deleteProject: vi.fn(),
}));
vi.mock('../projects/projectsApi', () => ({ archiveProject, deleteProject }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectActions } from './useProjectActions';

beforeEach(() => {
  archiveProject.mockReset();
  deleteProject.mockReset();
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
});
