import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMyTasks } from './myTasksApi';
import { groupByDue, type TaskBucket } from './groupByDue';
import { groupByPriority } from './groupByPriority';
import { readGroupMode, writeGroupMode, type GroupMode } from './groupMode';
import { setTaskDone } from '../task/tasksApi';
import { isDone } from '../task/taskMeta';
import { overdueCount } from '../projects/taskCounts';
import { todayISO } from '../task/today';

/** My Tasks data: the owner's open tasks grouped by the chosen mode (due date
 * or priority), overdue + open-total counts for the header, a complete toggle,
 * and a persisted group-by switch. All server state via react-query. */
export function useMyTasks() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const [groupMode, setMode] = useState<GroupMode>(readGroupMode);

  const setGroupMode = (mode: GroupMode) => {
    writeGroupMode(mode);
    setMode(mode);
  };

  const { buckets, overdue, openTotal } = useMemo(() => {
    const today = todayISO();
    const data = query.data ?? [];
    const grouped: TaskBucket[] =
      groupMode === 'priority' ? groupByPriority(data) : groupByDue(data, today);
    return {
      buckets: grouped,
      overdue: overdueCount(data, today),
      openTotal: data.filter((t) => !isDone(t)).length,
    };
  }, [query.data, groupMode]);

  const toggleDone = useMutation({
    mutationFn: (input: { id: string; done: boolean; now: string }) =>
      setTaskDone(input.id, input.done, input.now),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-tasks'] }),
  });

  return { query, buckets, overdue, openTotal, groupMode, setGroupMode, toggleDone };
}
