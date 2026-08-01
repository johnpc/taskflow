import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks, todayISO } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  todayISO: vi.fn(),
}));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../task/today', () => ({ todayISO }));

import { hookWrapper } from '../../test/hookWrapper';
import { useCalendarMonth } from './useCalendarMonth';

beforeEach(() => {
  fetchMyTasks.mockReset();
  todayISO.mockReturnValue('2026-08-15');
});

describe('useCalendarMonth', () => {
  it('lays the owner tasks onto the anchored month grid', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'A', status: 'TODO', dueDate: '2026-08-20' },
    ]);
    const { result } = renderHook(() => useCalendarMonth(), { wrapper: hookWrapper() });
    await waitFor(() =>
      expect(result.current.weeks.flat().some((c) => c.tasks.length > 0)).toBe(true),
    );
    expect(result.current.title).toBe('August 2026');
    expect(result.current.atStart).toBe(true);
  });

  it('pages a month forward (crossing the year end) and clamps prev at this month', async () => {
    fetchMyTasks.mockResolvedValue([]);
    todayISO.mockReturnValue('2026-12-10');
    const { result } = renderHook(() => useCalendarMonth(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.title).toBe('December 2026'));
    act(() => result.current.nextMonth());
    await waitFor(() => expect(result.current.title).toBe('January 2027'));
    expect(result.current.atStart).toBe(false);
    act(() => result.current.goThisMonth());
    await waitFor(() => expect(result.current.atStart).toBe(true));
  });
});
