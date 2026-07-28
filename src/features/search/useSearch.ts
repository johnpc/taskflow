import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import { matchTasks } from './matchTasks';

/** Search data: the owner's tasks (reused from the My Tasks fetch) filtered by
 * the live query string. Server fetch via react-query; filtering is pure. */
export function useSearch() {
  const [query, setQuery] = useState('');
  const tasksQuery = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });

  const results = useMemo(() => matchTasks(tasksQuery.data ?? [], query), [tasksQuery.data, query]);

  return { query, setQuery, results, tasksQuery };
}
