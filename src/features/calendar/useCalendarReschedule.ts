import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../task/tasksApi';

/** Reschedule mutation for the calendar month grid: set a task's due date to the
 * day it was dropped on, then refresh the My Tasks + board queries so the chip
 * moves to its new cell. */
export function useCalendarReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; dueDate: string }) => updateTask(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-tasks'] });
      qc.invalidateQueries({ queryKey: ['board'] });
    },
  });
}
