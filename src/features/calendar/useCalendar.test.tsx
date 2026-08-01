import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchMyTasks, todayISO } = vi.hoisted(() => ({
  fetchMyTasks: vi.fn(),
  todayISO: vi.fn(),
}));
vi.mock('../mytasks/myTasksApi', () => ({ fetchMyTasks }));
vi.mock('../task/today', () => ({ todayISO }));

import { hookWrapper } from '../../test/hookWrapper';
import { useCalendar } from './useCalendar';

beforeEach(() => {
  fetchMyTasks.mockReset();
  todayISO.mockReturnValue('2026-07-30');
});

describe('useCalendar', () => {
  it('groups the owner tasks over the two-week horizon by day', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'A', status: 'TODO', dueDate: '2026-07-31' },
      { id: 'b', title: 'B', status: 'TODO', dueDate: '2026-09-01' }, // outside horizon
    ]);
    const { result } = renderHook(() => useCalendar(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.days.length).toBe(1));
    expect(result.current.days[0].date).toBe('2026-07-31');
    expect(result.current.days[0].label).toBe('Tomorrow');
  });

  it('pages a week forward to surface a later task, and clamps prev at today', async () => {
    fetchMyTasks.mockResolvedValue([
      { id: 'a', title: 'A', status: 'TODO', dueDate: '2026-07-31' },
      { id: 'c', title: 'C', status: 'TODO', dueDate: '2026-08-18' }, // ~19d out
    ]);
    const { result } = renderHook(() => useCalendar(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.days.length).toBe(1));
    expect(result.current.atStart).toBe(true);
    // Next week shifts the window forward; the +19d task now falls inside it.
    act(() => result.current.nextWeek());
    await waitFor(() =>
      expect(result.current.days.some((d) => d.date === '2026-08-18')).toBe(true),
    );
    expect(result.current.atStart).toBe(false);
    // Back to today re-clamps to offset 0.
    act(() => result.current.goToday());
    await waitFor(() => expect(result.current.atStart).toBe(true));
  });
});
