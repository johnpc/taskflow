import { useMemo } from 'react';
import { useProjects } from './useProjects';

export interface ProjectRef {
  name: string;
  color: string | null;
}

/** Lookup of projectId → {name, color} for labeling tasks in cross-project
 * views (My Tasks, Search). Derived from the projects list; empty until loaded. */
export function useProjectsById(): Map<string, ProjectRef> {
  const { data } = useProjects();
  return useMemo(() => {
    const map = new Map<string, ProjectRef>();
    for (const p of data ?? []) map.set(p.id, { name: p.name, color: p.color ?? null });
    return map;
  }, [data]);
}
