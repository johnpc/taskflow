import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const { fetchResources, addResource, removeResource } = vi.hoisted(() => ({
  fetchResources: vi.fn(),
  addResource: vi.fn(),
  removeResource: vi.fn(),
}));
vi.mock('../projects/projectResourcesApi', () => ({ fetchResources, addResource, removeResource }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectResources } from './useProjectResources';

beforeEach(() => {
  fetchResources.mockReset().mockResolvedValue([{ id: 'r', title: 'Spec', url: 'https://x.co' }]);
  addResource.mockReset().mockResolvedValue(undefined);
  removeResource.mockReset().mockResolvedValue(undefined);
});

describe('useProjectResources', () => {
  it('loads a project’s resources and adds/removes them', async () => {
    const { result } = renderHook(() => useProjectResources('p1'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.data).toHaveLength(1));

    await act(async () => {
      await result.current.add.mutateAsync({ title: 'Doc', url: 'https://d.co' });
    });
    expect(addResource).toHaveBeenCalledWith({
      projectId: 'p1',
      title: 'Doc',
      url: 'https://d.co',
    });

    await act(async () => {
      await result.current.remove.mutateAsync('r');
    });
    expect(removeResource).toHaveBeenCalledWith('r');
  });
});
