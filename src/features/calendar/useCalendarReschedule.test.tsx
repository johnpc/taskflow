import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { updateTask } = vi.hoisted(() => ({ updateTask: vi.fn() }));
vi.mock('../task/tasksApi', () => ({ updateTask }));

import { hookWrapper } from '../../test/hookWrapper';
import { useCalendarReschedule } from './useCalendarReschedule';

beforeEach(() => updateTask.mockReset().mockResolvedValue(undefined));

describe('useCalendarReschedule', () => {
  it('updates the task due date to the dropped day', async () => {
    const { result } = renderHook(() => useCalendarReschedule(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ id: 't1', dueDate: '2026-08-14' });
    });
    expect(updateTask).toHaveBeenCalledWith({ id: 't1', dueDate: '2026-08-14' });
  });
});
