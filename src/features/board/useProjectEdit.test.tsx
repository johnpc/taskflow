import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { updateProject } = vi.hoisted(() => ({ updateProject: vi.fn() }));
vi.mock('../projects/projectsApi', () => ({ updateProject }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectEdit } from './useProjectEdit';

beforeEach(() => updateProject.mockReset());

describe('useProjectEdit', () => {
  it('updates the project description', async () => {
    updateProject.mockResolvedValue(undefined);
    const { result } = renderHook(() => useProjectEdit('p'), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ id: 'p', description: 'plan' });
    });
    expect(updateProject).toHaveBeenCalledWith({ id: 'p', description: 'plan' });
  });
});
