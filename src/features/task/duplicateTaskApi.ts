import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { duplicateInput } from './duplicateInput';
import { membersForProject } from '../auth/members';

/** Duplicate a task: a fresh TODO copy in the same section (see duplicateInput
 * for what carries over). Returns the new task. */
export async function duplicateTask(task: TaskRecord, order: number): Promise<TaskRecord> {
  const members = await membersForProject(task.projectId);
  const { data, errors } = await dataClient.models.Task.create({
    ...duplicateInput(task, order),
    members,
  });
  if (errors || !data) throw new Error(`Duplicate task failed: ${JSON.stringify(errors)}`);
  return data;
}
