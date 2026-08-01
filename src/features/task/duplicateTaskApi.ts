import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { duplicateInput, subtaskCopyInput } from './duplicateInput';
import { fetchAttachments } from './attachmentsApi';
import { membersForProject } from '../auth/members';

/** Duplicate a task: a fresh TODO copy in the same section (see duplicateInput
 * for what carries over), plus fresh TODO copies of its subtasks parented to
 * the new task and its LINK attachments (Asana copies subtasks + attachments).
 * File attachments are skipped — they'd need the S3 object copied too. Returns
 * the new parent task. */
export async function duplicateTask(task: TaskRecord, order: number): Promise<TaskRecord> {
  const members = await membersForProject(task.projectId);
  const { data, errors } = await dataClient.models.Task.create({
    ...duplicateInput(task, order),
    members,
  });
  if (errors || !data) throw new Error(`Duplicate task failed: ${JSON.stringify(errors)}`);
  await copySubtasks(task.id, data.id, task.projectId, members);
  await copyLinkAttachments(task.id, data.id, members);
  return data;
}

/** Copy a source task's LINK attachments (those without an S3 storageKey) onto
 * the new task. Best-effort per link so one failure doesn't abort the rest. */
async function copyLinkAttachments(
  sourceId: string,
  newTaskId: string,
  members: string[],
): Promise<void> {
  const links = (await fetchAttachments(sourceId)).filter((a) => !a.storageKey);
  for (const link of links) {
    await dataClient.models.Attachment.create({
      taskId: newTaskId,
      url: link.url,
      title: link.title ?? undefined,
      members,
    }).catch(() => undefined);
  }
}

/** Copy a source task's subtasks under the new parent (best-effort per child so
 * one failure doesn't abort the rest; the parent copy already succeeded). */
async function copySubtasks(
  sourceId: string,
  newParentId: string,
  projectId: string,
  members: string[],
): Promise<void> {
  const { data: subs } = await dataClient.models.Task.listTaskByParentTaskId(
    { parentTaskId: sourceId },
    { limit: 200 },
  );
  for (const sub of (subs ?? []).filter(Boolean) as TaskRecord[]) {
    await dataClient.models.Task.create({
      ...subtaskCopyInput(sub, newParentId, projectId),
      members,
    }).catch(() => undefined);
  }
}
