/**
 * Task-detail server state — one task with its subtasks and comments. Thin I/O;
 * each list is a bounded per-parent GSI query.
 */
import { dataClient, type TaskRecord, type CommentRecord } from '../../lib/dataClient';

export interface TaskDetailData {
  task: TaskRecord | null;
  subtasks: TaskRecord[];
  comments: CommentRecord[];
}

/** Load a task, its subtasks (children), and its comments. */
export async function fetchTaskDetail(id: string): Promise<TaskDetailData> {
  const { data: task } = await dataClient.models.Task.get({ id });
  const [subRes, commentRes] = await Promise.all([
    dataClient.models.Task.listTaskByParentTaskId({ parentTaskId: id }, { limit: 200 }),
    dataClient.models.Comment.listCommentByTaskId({ taskId: id }, { limit: 200 }),
  ]);
  const subtasks = ((subRes.data ?? []).filter(Boolean) as TaskRecord[]).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const comments = ((commentRes.data ?? []).filter(Boolean) as CommentRecord[]).sort((a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
  );
  return { task: task ?? null, subtasks, comments };
}

/** Add a comment to a task. */
export async function addComment(input: {
  taskId: string;
  body: string;
  authorEmail: string | null;
}): Promise<CommentRecord> {
  const { data, errors } = await dataClient.models.Comment.create({
    taskId: input.taskId,
    body: input.body.trim(),
    authorEmail: input.authorEmail ?? undefined,
  });
  if (errors || !data) throw new Error(`Add comment failed: ${JSON.stringify(errors)}`);
  return data;
}
