import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setTaskDone, updateTask } from '../task/tasksApi';
import type { FocusBucket } from './groupByFocus';

/** My Tasks mutations — complete/reopen a task and re-file it into a focus
 * bucket — each invalidating the my-tasks query on success. Split from useMyTasks
 * so that hub stays within the line limit. */
export function useMyTasksMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['my-tasks'] });

  const toggleDone = useMutation({
    mutationFn: (input: { id: string; done: boolean; now: string }) =>
      setTaskDone(input.id, input.done, input.now),
    onSuccess: invalidate,
  });

  const setBucket = useMutation({
    mutationFn: (input: { id: string; myBucket: FocusBucket }) => updateTask(input),
    onSuccess: invalidate,
  });

  return { toggleDone, setBucket };
}
