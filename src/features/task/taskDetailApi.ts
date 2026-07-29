/**
 * Task-detail server state — one task with its subtasks and comments. Thin I/O;
 * each list is a bounded per-parent GSI query.
 */
import { dataClient, type TaskRecord, type CommentRecord } from '../../lib/dataClient';
import { fetchAttachments } from './attachmentsApi';
import type { AttachmentRecord } from '../../lib/dataClient';

export interface TaskDetailData {
  task: TaskRecord | null;
  subtasks: TaskRecord[];
  comments: CommentRecord[];
  attachments: AttachmentRecord[];
}

/** Load a task, its subtasks (children), comments, and attachments. */
export async function fetchTaskDetail(id: string): Promise<TaskDetailData> {
  const { data: task } = await dataClient.models.Task.get({ id });
  const [subRes, commentRes, attachments] = await Promise.all([
    dataClient.models.Task.listTaskByParentTaskId({ parentTaskId: id }, { limit: 200 }),
    dataClient.models.Comment.listCommentByTaskId({ taskId: id }, { limit: 200 }),
    fetchAttachments(id),
  ]);
  const subtasks = ((subRes.data ?? []).filter(Boolean) as TaskRecord[]).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const comments = ((commentRes.data ?? []).filter(Boolean) as CommentRecord[]).sort((a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
  );
  return { task: task ?? null, subtasks, comments, attachments };
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
