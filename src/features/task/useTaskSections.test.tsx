import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { listSections } = vi.hoisted(() => ({ listSections: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Section: { listSectionByProjectIdAndSortOrder: listSections } } },
}));

import { hookWrapper } from '../../test/hookWrapper';
import { useTaskSections } from './useTaskSections';

beforeEach(() => listSections.mockReset());

describe('useTaskSections', () => {
  it('fetches the project sections', async () => {
    listSections.mockResolvedValue({ data: [{ id: 's1' }, null] });
    const { result } = renderHook(() => useTaskSections('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 's1' }]));
  });

  it('is disabled with no projectId', () => {
    const { result } = renderHook(() => useTaskSections(undefined), { wrapper: hookWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(listSections).not.toHaveBeenCalled();
  });
});
