import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

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
});
