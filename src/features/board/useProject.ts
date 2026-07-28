import { useQuery } from '@tanstack/react-query';
import { fetchProject } from '../projects/projectsApi';

/** Single-project header data (name, color, view) for the board screen. */
export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
}
