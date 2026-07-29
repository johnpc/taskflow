import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { fetchProjects } from '../projects/projectsApi';
import { homeSummary } from './homeSummary';
import { todayISO } from '../task/today';

/** Home dashboard data: the task summary (today / overdue / upcoming) + the
 * project list for shortcuts. Reuses the My Tasks + Projects fetches. */
export function useHome() {
  const tasks = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  const summary = useMemo(() => homeSummary(tasks.data ?? [], todayISO()), [tasks.data]);

  return { tasks, projects, summary };
}
