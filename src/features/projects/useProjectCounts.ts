import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { openCountByProject } from './taskCounts';

/** Open-task counts per project, derived from the shared all-tasks fetch. Used
 * to badge project cards. Returns an empty map until the fetch resolves. */
export function useProjectCounts(): Map<string, number> {
  const { data } = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  return useMemo(() => openCountByProject(data ?? []), [data]);
}
