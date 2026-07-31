import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { duplicateInput, subtaskCopyInput } from './duplicateInput';
import { membersForProject } from '../auth/members';

/** Duplicate a task: a fresh TODO copy in the same section (see duplicateInput
 * for what carries over), plus fresh TODO copies of its subtasks parented to
 * the new task (Asana copies subtasks). Returns the new parent task. */
export async function duplicateTask(task: TaskRecord, order: number): Promise<TaskRecord> {
  const members = await membersForProject(task.projectId);
  const { data, errors } = await dataClient.models.Task.create({
    ...duplicateInput(task, order),
    members,
  });
  if (errors || !data) throw new Error(`Duplicate task failed: ${JSON.stringify(errors)}`);
  await copySubtasks(task.id, data.id, task.projectId, members);
  return data;
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
