import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTaskDetail } from './taskDetailApi';
import { createTask, setTaskDone, updateTask, deleteTask } from './tasksApi';
import { duplicateTask } from './duplicateTaskApi';
import { promoteSubtask } from './promoteSubtask';
import { useAttachments } from './useAttachments';
import { useComments } from './useComments';
import { useTaskMove } from './useTaskMove';
import { useAuth } from '../auth/useAuth';
import { useLabels } from '../labels/useLabels';
import type { TaskRecord } from '../../lib/dataClient';

/** Everything the task-detail screen needs: the task + subtasks + comments, and
 * the mutations to edit fields, toggle done, add a subtask/comment, and delete.
 * All server state via react-query; the whole detail refetches on any change. */
export function useTaskDetail(id: string) {
  const qc = useQueryClient();
  const { email } = useAuth();
  const key = ['task', id];
  const query = useQuery({ queryKey: key, queryFn: () => fetchTaskDetail(id), enabled: !!id });
  // Invalidate this task AND the aggregate views a task edit/delete affects
  // (board columns, My Tasks) so they refetch — e.g. a deleted task must vanish
  // from the board the detail navigates back to.
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ['board'] });
    qc.invalidateQueries({ queryKey: ['my-tasks'] });
    qc.invalidateQueries({ queryKey: ['project-tasks'] });
    qc.invalidateQueries({ queryKey: ['task-events', id] });
  };

  const patch = useMutation({
    mutationFn: (input: Parameters<typeof updateTask>[0]) => updateTask(input),
    onSuccess: invalidate,
  });

  const toggleDone = useMutation({
    mutationFn: (input: { taskId: string; done: boolean; now: string }) =>
      setTaskDone(input.taskId, input.done, input.now),
    onSuccess: invalidate,
  });

  const addSubtask = useMutation({
    mutationFn: (input: { projectId: string; title: string; order: number }) =>
      createTask({ ...input, parentTaskId: id }),
    onSuccess: invalidate,
  });

  const comments = useComments(id, email, invalidate);

  const remove = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: invalidate,
  });

  const duplicate = useMutation({
    mutationFn: (task: TaskRecord) => duplicateTask(task, (task.sortOrder ?? 0) + 1),
    onSuccess: invalidate,
  });

  // Promote a subtask to a standalone task: clear its parent and drop it into
  // the project's first section so it surfaces on the board (subtasks carry no
  // section). Resolves the target section itself, so callers pass only the task.
  const promote = useMutation({
    mutationFn: (task: TaskRecord) => promoteSubtask(task),
    onSuccess: invalidate,
  });

  const labels = useLabels();
  const attachments = useAttachments(id, invalidate);
  const { projects, move } = useTaskMove(invalidate);

  return {
    query,
    patch,
    toggleDone,
    addSubtask,
    comments,
    remove,
    duplicate,
    promote,
    labels,
    attachments,
    projects,
    move,
    email,
  };
}

export type TaskDetailHook = ReturnType<typeof useTaskDetail>;
export type { TaskRecord };
