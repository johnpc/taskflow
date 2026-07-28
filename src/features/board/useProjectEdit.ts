import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../projects/projectsApi';

/** Mutation to edit a project's header fields (description), refreshing the
 * project + list queries on success. */
export function useProjectEdit(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof updateProject>[0]) => updateProject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
