import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMyTasks } from './myTasksApi';
import { selectBuckets } from './selectBuckets';
import { completedBucket } from './completedBucket';
import { readGroupMode, writeGroupMode, type GroupMode } from './groupMode';
import { readShowCompleted, writeShowCompleted } from './showCompletedStore';
import { setTaskDone, updateTask } from '../task/tasksApi';
import { isDone } from '../task/taskMeta';
import { overdueCount } from '../projects/taskCounts';
import { todayISO } from '../task/today';
import type { FocusBucket } from './groupByFocus';

/** My Tasks data: the owner's open tasks grouped by the chosen mode (due date,
 * priority, or focus), overdue + open-total counts, a complete toggle, a
 * persisted group-by switch, and a set-focus-bucket mutation. */
export function useMyTasks() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const [groupMode, setMode] = useState<GroupMode>(readGroupMode);
  const [showCompleted, setShow] = useState<boolean>(readShowCompleted);

  const setGroupMode = (mode: GroupMode) => {
    writeGroupMode(mode);
    setMode(mode);
  };

  const setShowCompleted = (show: boolean) => {
    writeShowCompleted(show);
    setShow(show);
  };

  const { buckets, overdue, openTotal } = useMemo(() => {
    const today = todayISO();
    const data = query.data ?? [];
    const open = selectBuckets(groupMode, data, today);
    return {
      buckets: showCompleted ? [...open, ...completedBucket(data)] : open,
      overdue: overdueCount(data, today),
      openTotal: data.filter((t) => !isDone(t)).length,
    };
  }, [query.data, groupMode, showCompleted]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['my-tasks'] });

  const toggleDone = useMutation({
    mutationFn: (input: { id: string; done: boolean; now: string }) =>
      setTaskDone(input.id, input.done, input.now),
    onSuccess: invalidate,
  });

  const setBucket = useMutation({
    mutationFn: (input: { id: string; myBucket: FocusBucket }) => updateTask(input),
    onSuccess: invalidate,
  });

  return {
    query,
    buckets,
    overdue,
    openTotal,
    groupMode,
    setGroupMode,
    showCompleted,
    setShowCompleted,
    toggleDone,
    setBucket,
  };
}
