import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '../mytasks/myTasksApi';
import {
  matchTasks,
  filterResults,
  DEFAULT_SEARCH_FILTERS,
  type SearchFilters,
} from './matchTasks';

/** Search data: the owner's tasks (reused from the My Tasks fetch) filtered by
 * the live query string, then narrowed by priority + completion filters.
 * Server fetch via react-query; matching + filtering are pure. */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const tasksQuery = useQuery({ queryKey: ['my-tasks'], queryFn: fetchMyTasks });

  const results = useMemo(
    () => filterResults(matchTasks(tasksQuery.data ?? [], query), filters),
    [tasksQuery.data, query, filters],
  );

  return { query, setQuery, filters, setFilters, results, tasksQuery };
}
