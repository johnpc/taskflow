import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { groupByDay } from './groupByDay';
import { horizonDates, shiftDate } from './horizon';
import { todayISO } from '../task/today';

const HORIZON_DAYS = 14;

/** Calendar data: the owner's open, dated tasks over a two-week window, grouped
 * by day. The window starts today and can page forward/back a week at a time
 * (weekOffset). Reuses the My Tasks fetch; the day grouping is pure. */
export function useCalendar() {
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const [weekOffset, setWeekOffset] = useState(0);

  const days = useMemo(() => {
    const today = todayISO();
    const start = shiftDate(today, weekOffset * 7);
    const horizon = horizonDates(start, HORIZON_DAYS);
    // "Today"/"Tomorrow" labels only apply in the current window (offset 0).
    const tomorrow = horizonDates(today, 2)[1] ?? today;
    return groupByDay(query.data ?? [], today, tomorrow, horizon);
  }, [query.data, weekOffset]);

  return {
    query,
    days,
    atStart: weekOffset <= 0,
    prevWeek: () => setWeekOffset((o) => o - 1),
    nextWeek: () => setWeekOffset((o) => o + 1),
    goToday: () => setWeekOffset(0),
  };
}
