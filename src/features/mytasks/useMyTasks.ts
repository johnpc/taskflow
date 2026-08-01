import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from './myTasksApi';
import { buildMyTasksBuckets } from './myTasksView';
import { usePersistedState } from './usePersistedState';
import { useMyTasksMutations } from './useMyTasksMutations';
import { readGroupMode, writeGroupMode, type GroupMode } from './groupMode';
import { readShowCompleted, writeShowCompleted } from './showCompletedStore';
import { readAssignedOnly, writeAssignedOnly } from './assignedOnlyStore';
import { readFollowingOnly, writeFollowingOnly } from './followingOnlyStore';
import { readMyTasksSort, writeMyTasksSort } from './myTasksSortStore';
import { filterAssignedToMe } from './assignedFilter';
import { filterFollowing } from './followingFilter';
import { isDone } from '../task/taskMeta';
import { overdueCount } from '../projects/taskCounts';
import { todayISO } from '../task/today';
import { useAuth } from '../auth/useAuth';
import { useProjectsById } from '../projects/useProjectsById';
import type { ListSort } from '../board/listSort';

/** My Tasks data: the owner's open tasks grouped by the chosen mode (due date,
 * priority, or focus), overdue + open-total counts, a complete toggle, a
 * persisted group-by switch, and a set-focus-bucket mutation. */
export function useMyTasks() {
  const { email } = useAuth();
  const projectsById = useProjectsById();
  const query = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const [groupMode, setGroupMode] = usePersistedState<GroupMode>(readGroupMode, writeGroupMode);
  const [showCompleted, setShowCompleted] = usePersistedState(
    readShowCompleted,
    writeShowCompleted,
  );
  const [assignedOnly, setAssignedOnly] = usePersistedState(readAssignedOnly, writeAssignedOnly);
  const [followingOnly, setFollowingOnly] = usePersistedState(
    readFollowingOnly,
    writeFollowingOnly,
  );
  const [sort, setSort] = usePersistedState<ListSort>(readMyTasksSort, writeMyTasksSort);

  const { buckets, overdue, openTotal } = useMemo(() => {
    const today = todayISO();
    const assigned = filterAssignedToMe(query.data ?? [], email, assignedOnly);
    const data = filterFollowing(assigned, email, followingOnly);
    return {
      buckets: buildMyTasksBuckets({
        tasks: data,
        mode: groupMode,
        today,
        showCompleted,
        sort,
        projectName: (id) => projectsById.get(id)?.name,
      }),
      overdue: overdueCount(data, today),
      openTotal: data.filter((t) => !isDone(t)).length,
    };
  }, [
    query.data,
    groupMode,
    showCompleted,
    assignedOnly,
    followingOnly,
    sort,
    email,
    projectsById,
  ]);

  const { toggleDone, setBucket } = useMyTasksMutations();

  return {
    query,
    buckets,
    overdue,
    openTotal,
    groupMode,
    setGroupMode,
    showCompleted,
    setShowCompleted,
    assignedOnly,
    setAssignedOnly,
    followingOnly,
    setFollowingOnly,
    sort,
    setSort,
    toggleDone,
    setBucket,
  };
}
