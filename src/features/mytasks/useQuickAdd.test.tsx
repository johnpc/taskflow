import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { quickAddTask } = vi.hoisted(() => ({ quickAddTask: vi.fn() }));
vi.mock('./quickAddApi', () => ({ quickAddTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useQuickAdd } from './useQuickAdd';

beforeEach(() => quickAddTask.mockReset().mockResolvedValue(undefined));

describe('useQuickAdd', () => {
  it('quick-adds a task to the chosen project', async () => {
    const { result } = renderHook(() => useQuickAdd(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ projectId: 'p1', title: 'Buy milk' });
    });
    expect(quickAddTask).toHaveBeenCalledWith('p1', 'Buy milk');
  });
});
