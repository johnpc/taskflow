import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { withLabelId, withoutLabelId } from './withLabelId';

/** Apply a per-task labelIds transform to each id (read-modify-write). One task
 * at a time; a failure on one is surfaced (caller invalidates on success). */
async function applyLabels(
  ids: string[],
  next: (current: TaskRecord['labelIds']) => string[],
): Promise<void> {
  for (const id of ids) {
    const { data: task } = await dataClient.models.Task.get({ id });
    if (!task) continue;
    const { errors } = await dataClient.models.Task.update({ id, labelIds: next(task.labelIds) });
    if (errors) throw new Error(`Bulk label failed: ${JSON.stringify(errors)}`);
  }
}

/** Add a label to each of the given tasks (idempotent). */
export function addLabelToTasks(ids: string[], labelId: string): Promise<void> {
  return applyLabels(ids, (current) => withLabelId(current, labelId));
}

/** Remove a label from each of the given tasks (no-op where absent). */
export function removeLabelFromTasks(ids: string[], labelId: string): Promise<void> {
  return applyLabels(ids, (current) => withoutLabelId(current, labelId));
}
