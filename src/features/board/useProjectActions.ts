import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { archiveProject, deleteProject, type ProjectRecord } from '../projects/projectsApi';
import { duplicateProject } from '../projects/duplicateProjectApi';
import { useProjects } from '../projects/useProjects';

/** Archive / delete / duplicate a project. Archive + delete then leave to the
 * project list; duplicate opens the fresh copy. Navigation fires right after the
 * mutation (confirmed server-side regardless); lists refetch via invalidation.
 * Exposes ready handlers so the board screen just wires them to the menu. */
export function useProjectActions(projectId: string) {
  const qc = useQueryClient();
  const history = useHistory();
  const projects = useProjects().data ?? [];
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['projects'] });
    qc.invalidateQueries({ queryKey: ['project', projectId] });
  };

  const archive = useMutation({ mutationFn: () => archiveProject(projectId), onSuccess: refresh });
  const remove = useMutation({ mutationFn: () => deleteProject(projectId), onSuccess: refresh });
  const duplicate = useMutation({
    mutationFn: (source: ProjectRecord) => duplicateProject(source, projects.length),
    onSuccess: (created) => {
      refresh();
      history.push(`/projects/${created.id}`);
    },
  });

  const archiveAndLeave = () => {
    archive.mutate();
    history.replace('/projects');
  };
  const deleteAndLeave = () => {
    remove.mutate();
    history.replace('/projects');
  };

  return { archive, remove, duplicate, archiveAndLeave, deleteAndLeave };
}
