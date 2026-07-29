import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { progressByProject, type Progress } from './taskCounts';

/** Completion progress (done/total) per project, derived from the shared
 * all-tasks fetch — reuses the same query key as the counts, so no extra
 * request. Empty map until the fetch resolves. */
export function useProjectProgress(): Map<string, Progress> {
  const { data } = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  return useMemo(() => progressByProject(data ?? []), [data]);
}
