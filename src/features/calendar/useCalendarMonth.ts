import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { monthMatrix, monthLabel } from './monthGrid';
import { todayISO } from '../task/today';

/** Calendar month-grid data: the owner's open, dated tasks laid out on a
 * Sunday-first month matrix. The anchored month pages forward/back a month at a
 * time (monthOffset). Reuses the My Tasks fetch (react-query dedupes it with the
 * list view); the matrix is pure. */
export function useCalendarMonth() {
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const [monthOffset, setMonthOffset] = useState(0);

  const { weeks, title } = useMemo(() => {
    const today = todayISO();
    const [ty, tm] = today.split('-').map(Number);
    const total = ty * 12 + (tm - 1) + monthOffset;
    const year = Math.floor(total / 12);
    const month = (total % 12) + 1;
    return {
      weeks: monthMatrix(year, month, today, query.data ?? []),
      title: monthLabel(year, month),
    };
  }, [query.data, monthOffset]);

  return {
    query,
    weeks,
    title,
    atStart: monthOffset <= 0,
    prevMonth: () => setMonthOffset((o) => o - 1),
    nextMonth: () => setMonthOffset((o) => o + 1),
    goThisMonth: () => setMonthOffset(0),
  };
}
