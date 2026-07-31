import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quickAddTask } from './quickAddApi';

/** Quick-add mutation for My Tasks: create a task in a chosen project, then
 * refresh the My Tasks + board queries so it appears. */
export function useQuickAdd() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { projectId: string; title: string }) =>
      quickAddTask(input.projectId, input.title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-tasks'] });
      qc.invalidateQueries({ queryKey: ['board'] });
    },
  });
}
