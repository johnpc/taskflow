import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchLabels, createLabel } = vi.hoisted(() => ({
  fetchLabels: vi.fn(),
  createLabel: vi.fn(),
}));
vi.mock('./labelsApi', () => ({ fetchLabels, createLabel }));

import { hookWrapper } from '../../test/hookWrapper';
import { useLabels } from './useLabels';

beforeEach(() => {
  fetchLabels.mockReset();
  createLabel.mockReset();
});

describe('useLabels', () => {
  it('returns the label registry', async () => {
    fetchLabels.mockResolvedValue([{ id: 'a', name: 'Marketing' }]);
    const { result } = renderHook(() => useLabels(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.query.data).toHaveLength(1));
  });

  it('creates a label', async () => {
    fetchLabels.mockResolvedValue([]);
    createLabel.mockResolvedValue({ id: 'new' });
    const { result } = renderHook(() => useLabels(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.create.mutateAsync({ name: 'Urgent', color: 'rose' });
    });
    expect(createLabel).toHaveBeenCalledWith({ name: 'Urgent', color: 'rose' });
  });
});
