import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTaskDetail, addComment } from './taskDetailApi';
import { createTask, setTaskDone, updateTask, deleteTask } from './tasksApi';
import { useAuth } from '../auth/useAuth';
import type { TaskRecord } from '../../lib/dataClient';

/** Everything the task-detail screen needs: the task + subtasks + comments, and
 * the mutations to edit fields, toggle done, add a subtask/comment, and delete.
 * All server state via react-query; the whole detail refetches on any change. */
export function useTaskDetail(id: string) {
  const qc = useQueryClient();
  const { email } = useAuth();
  const key = ['task', id];
  const query = useQuery({ queryKey: key, queryFn: () => fetchTaskDetail(id), enabled: !!id });
  const invalidate = () => qc.invalidateQueries({ queryKey: key });

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

  const comment = useMutation({
    mutationFn: (body: string) => addComment({ taskId: id, body, authorEmail: email }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: invalidate,
  });

  return { query, patch, toggleDone, addSubtask, comment, remove };
}

export type TaskDetailHook = ReturnType<typeof useTaskDetail>;
export type { TaskRecord };
