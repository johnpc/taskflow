import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor, renderHook, act } from '@testing-library/react';

const { fetchProjects, createProject, setProjectFavorite } = vi.hoisted(() => ({
  fetchProjects: vi.fn(),
  createProject: vi.fn(),
  setProjectFavorite: vi.fn(),
}));
vi.mock('./projectsApi', () => ({ fetchProjects, createProject, setProjectFavorite }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjects, useCreateProject, useToggleFavorite } from './useProjects';

beforeEach(() => {
  fetchProjects.mockReset();
  createProject.mockReset();
  setProjectFavorite.mockReset();
});

describe('useProjects', () => {
  it('returns fetched projects', async () => {
    fetchProjects.mockResolvedValue([{ id: 'a' }]);
    const { result } = renderHook(() => useProjects(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 'a' }]));
  });
});

describe('useCreateProject', () => {
  it('creates a project', async () => {
    createProject.mockResolvedValue({ id: 'new' });
    const { result } = renderHook(() => useCreateProject(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ name: 'X', existingCount: 0 });
    });
    expect(createProject).toHaveBeenCalledWith({ name: 'X', existingCount: 0 });
  });
});

describe('useToggleFavorite', () => {
  it('toggles favorite', async () => {
    setProjectFavorite.mockResolvedValue(undefined);
    const { result } = renderHook(() => useToggleFavorite(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ id: 'a', favorite: true });
    });
    expect(setProjectFavorite).toHaveBeenCalledWith('a', true);
  });
});
