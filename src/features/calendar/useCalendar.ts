import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { groupByDay } from './groupByDay';
import { horizonDates } from './horizon';
import { todayISO } from '../task/today';

const HORIZON_DAYS = 14;

/** Calendar data: the owner's open, dated tasks over the next two weeks, grouped
 * by day. Reuses the My Tasks fetch; the day grouping is pure. */
export function useCalendar() {
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });

  const days = useMemo(() => {
    const today = todayISO();
    const horizon = horizonDates(today, HORIZON_DAYS);
    const tomorrow = horizon[1] ?? today;
    return groupByDay(query.data ?? [], today, tomorrow, horizon);
  }, [query.data]);

  return { query, days };
}
