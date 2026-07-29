import { useHistory } from 'react-router-dom';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

/** The task-detail navigation handlers that pair a mutation with a route change:
 * deleting returns to the project board, duplicating opens the copy, and opening
 * a subtask/parent pushes its detail. Keeps TaskDetailBody a thin renderer. */
export function useTaskDetailNav(task: TaskRecord, hook: TaskDetailHook) {
  const history = useHistory();
  return {
    deleteTask: () =>
      hook.remove.mutate(task.id, {
        onSuccess: () => history.replace(`/projects/${task.projectId}`),
      }),
    duplicateTask: () =>
      hook.duplicate.mutate(task, { onSuccess: (copy) => history.push(`/tasks/${copy.id}`) }),
    openTask: (id: string) => history.push(`/tasks/${id}`),
  };
}
