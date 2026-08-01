import { useMutation } from '@tanstack/react-query';
import { setTaskDone, updateTask, deleteTask } from '../task/tasksApi';
import { addLabelToTasks, removeLabelFromTasks } from '../labels/bulkLabelApi';
import type { Priority } from '../task/taskMeta';

/** The board's bulk (multi-select) mutations — complete, move-to-section, and
 * delete a set of task ids — each invalidating the board on success. Split from
 * useBoard so that hub stays within the line limit. */
export function useBulkMutations(invalidate: () => void) {
  const bulkComplete = useMutation({
    mutationFn: (input: { ids: string[]; now: string }) =>
      Promise.all(input.ids.map((id) => setTaskDone(id, true, input.now))),
    onSuccess: invalidate,
  });

  const bulkMove = useMutation({
    mutationFn: (input: { ids: string[]; sectionId: string }) =>
      Promise.all(input.ids.map((id) => updateTask({ id, sectionId: input.sectionId }))),
    onSuccess: invalidate,
  });

  const bulkAssign = useMutation({
    mutationFn: (input: { ids: string[]; assigneeEmail: string | null }) =>
      Promise.all(input.ids.map((id) => updateTask({ id, assigneeEmail: input.assigneeEmail }))),
    onSuccess: invalidate,
  });

  const bulkPriority = useMutation({
    mutationFn: (input: { ids: string[]; priority: Priority }) =>
      Promise.all(input.ids.map((id) => updateTask({ id, priority: input.priority }))),
    onSuccess: invalidate,
  });

  const bulkLabel = useMutation({
    mutationFn: (input: { ids: string[]; labelId: string }) =>
      addLabelToTasks(input.ids, input.labelId),
    onSuccess: invalidate,
  });

  const bulkUnlabel = useMutation({
    mutationFn: (input: { ids: string[]; labelId: string }) =>
      removeLabelFromTasks(input.ids, input.labelId),
    onSuccess: invalidate,
  });

  const bulkDelete = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteTask(id))),
    onSuccess: invalidate,
  });

  return { bulkComplete, bulkMove, bulkAssign, bulkPriority, bulkLabel, bulkUnlabel, bulkDelete };
}
