import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchProjects } = vi.hoisted(() => ({ fetchProjects: vi.fn() }));
vi.mock('./projectsApi', () => ({
  fetchProjects,
  createProject: vi.fn(),
  setProjectFavorite: vi.fn(),
}));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectsById } from './useProjectsById';

beforeEach(() => fetchProjects.mockReset());

describe('useProjectsById', () => {
  it('maps project id to name + color', async () => {
    fetchProjects.mockResolvedValue([{ id: 'p1', name: 'Launch', color: 'sky' }]);
    const { result } = renderHook(() => useProjectsById(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.get('p1')).toEqual({ name: 'Launch', color: 'sky' }));
  });
});
