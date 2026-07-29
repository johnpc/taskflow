import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMyTasks } from './myTasksApi';
import { groupByDue } from './groupByDue';
import { setTaskDone } from '../task/tasksApi';
import { overdueCount } from '../projects/taskCounts';
import { todayISO } from '../task/today';

/** My Tasks data: the owner's open tasks grouped into due buckets, an overdue
 * count for the header, plus a complete toggle. All server state via react-query. */
export function useMyTasks() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });

  const { buckets, overdue } = useMemo(() => {
    const today = todayISO();
    const data = query.data ?? [];
    return { buckets: groupByDue(data, today), overdue: overdueCount(data, today) };
  }, [query.data]);

  const toggleDone = useMutation({
    mutationFn: (input: { id: string; done: boolean; now: string }) =>
      setTaskDone(input.id, input.done, input.now),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-tasks'] }),
  });

  return { query, buckets, overdue, toggleDone };
}
