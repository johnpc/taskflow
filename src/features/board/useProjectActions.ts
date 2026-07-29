import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { archiveProject, deleteProject } from '../projects/projectsApi';

/** Archive / delete a project, then leave to the project list. Navigation fires
 * right after the mutation (confirmed server-side regardless); the list refetches
 * via the invalidation and shows the project gone. Exposes ready handlers so the
 * board screen just wires them to the menu. */
export function useProjectActions(projectId: string) {
  const qc = useQueryClient();
  const history = useHistory();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['projects'] });
    qc.invalidateQueries({ queryKey: ['project', projectId] });
  };

  const archive = useMutation({ mutationFn: () => archiveProject(projectId), onSuccess: refresh });
  const remove = useMutation({ mutationFn: () => deleteProject(projectId), onSuccess: refresh });

  const archiveAndLeave = () => {
    archive.mutate();
    history.replace('/projects');
  };
  const deleteAndLeave = () => {
    remove.mutate();
    history.replace('/projects');
  };

  return { archive, remove, archiveAndLeave, deleteAndLeave };
}
