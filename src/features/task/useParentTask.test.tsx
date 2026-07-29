import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({ dataClient: { models: { Task: { get } } } }));

import { hookWrapper } from '../../test/hookWrapper';
import { useParentTask } from './useParentTask';

beforeEach(() => get.mockReset());

describe('useParentTask', () => {
  it('fetches the parent task by id', async () => {
    get.mockResolvedValue({ data: { id: 'p', title: 'Parent' } });
    const { result } = renderHook(() => useParentTask('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.data?.title).toBe('Parent'));
  });

  it('is disabled with no parent id', () => {
    const { result } = renderHook(() => useParentTask(null), { wrapper: hookWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(get).not.toHaveBeenCalled();
  });
});
