import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchProject } = vi.hoisted(() => ({ fetchProject: vi.fn() }));
vi.mock('../projects/projectsApi', () => ({ fetchProject }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProject } from './useProject';

beforeEach(() => fetchProject.mockReset());

describe('useProject', () => {
  it('fetches a single project', async () => {
    fetchProject.mockResolvedValue({ id: 'p', name: 'Launch' });
    const { result } = renderHook(() => useProject('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data?.name).toBe('Launch'));
    expect(fetchProject).toHaveBeenCalledWith('p');
  });
});
