import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveProject, deleteProject } from '../projects/projectsApi';

/** Archive / delete mutations for a project. Both refresh the project list on
 * success so the archived/deleted project drops out immediately. */
export function useProjectActions(projectId: string) {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['projects'] });
    qc.invalidateQueries({ queryKey: ['project', projectId] });
  };

  const archive = useMutation({ mutationFn: () => archiveProject(projectId), onSuccess: refresh });
  const remove = useMutation({ mutationFn: () => deleteProject(projectId), onSuccess: refresh });

  return { archive, remove };
}
