import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchArchivedProjects, unarchiveProject } from './archivedApi';

/** The owner's archived projects (for the collapsible Archived section). */
export function useArchivedProjects() {
  return useQuery({ queryKey: ['projects', 'archived'], queryFn: fetchArchivedProjects });
}

/** Restore an archived project, refreshing both the active and archived lists. */
export function useUnarchiveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
