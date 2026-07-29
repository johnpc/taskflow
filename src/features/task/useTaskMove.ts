import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects } from '../projects/projectsApi';
import { fetchBoard, ensureDefaultSections } from '../board/boardApi';
import { updateTask } from './tasksApi';
import { resolveMove } from './resolveMove';

/** Task-detail "move to project" support: the owner's projects for the picker,
 * and a mutation that moves a task into a chosen project — landing it in that
 * project's first section (creating defaults if empty) and clearing blockers.
 * Invalidates the task + both boards + the aggregate views. */
export function useTaskMove(invalidate: () => void) {
  const qc = useQueryClient();
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  const move = useMutation({
    mutationFn: async (input: { taskId: string; projectId: string }) => {
      const board = await fetchBoard(input.projectId);
      const sections = await ensureDefaultSections(input.projectId, board.sections);
      const patch = resolveMove(input.taskId, input.projectId, sections);
      if (patch) await updateTask(patch);
    },
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['board'] });
    },
  });

  return { projects, move };
}
