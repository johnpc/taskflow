import { dataClient } from '../../lib/dataClient';
import { nextDueDate, repeats, type Repeat } from './recurrence';

/** After a task is completed, if it repeats and has a due date, create the next
 * occurrence: a fresh TODO copy with the due date advanced by the repeat period
 * and the same section / priority / repeat rule. No-op otherwise. Best-effort —
 * a spawn failure must not fail the completion itself. */
export async function spawnNextOccurrence(id: string): Promise<void> {
  const { data: task } = await dataClient.models.Task.get({ id });
  if (!task || !repeats(task.repeat as Repeat)) return;
  const due = nextDueDate(task.dueDate, task.repeat as Repeat);
  if (!due) return;
  await dataClient.models.Task.create({
    projectId: task.projectId,
    sectionId: task.sectionId || undefined,
    title: task.title,
    notes: task.notes,
    status: 'TODO',
    priority: task.priority,
    dueDate: due,
    dueTime: task.dueTime,
    sortOrder: (task.sortOrder ?? 0) + 1,
    repeat: task.repeat,
    labelIds: (task.labelIds ?? []).filter((x): x is string => !!x),
  });
}
