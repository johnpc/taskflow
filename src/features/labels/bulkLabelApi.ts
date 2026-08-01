import { dataClient } from '../../lib/dataClient';
import { withLabelId } from './withLabelId';

/** Add a label to each of the given tasks (bulk "add label to selected"). Reads
 * each task's current labelIds and merges the label id in (idempotent). One task
 * at a time; a failure on one is surfaced (caller invalidates on success). */
export async function addLabelToTasks(ids: string[], labelId: string): Promise<void> {
  for (const id of ids) {
    const { data: task } = await dataClient.models.Task.get({ id });
    if (!task) continue;
    const { errors } = await dataClient.models.Task.update({
      id,
      labelIds: withLabelId(task.labelIds, labelId),
    });
    if (errors) throw new Error(`Bulk label failed: ${JSON.stringify(errors)}`);
  }
}
