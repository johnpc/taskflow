import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, fetchProjects, setProjectFavorite } from './projectsApi';

/** react-query hook for the workspace project list. All fetching goes here. */
export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
}

/** Create a project, then invalidate the list so it re-renders with the new row. */
export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; existingCount: number }) => createProject(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

/** Toggle a project's favorite flag, refreshing the list on success. */
export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; favorite: boolean }) =>
      setProjectFavorite(input.id, input.favorite),
    onSuccess: (_data, input) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project', input.id] });
    },
  });
}
