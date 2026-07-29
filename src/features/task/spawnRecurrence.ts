import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { nextDueDate, repeats, type Repeat } from './recurrence';

/** Given a just-completed task RECORD, if it repeats and has a due date, create
 * the next occurrence: a fresh TODO copy with the due date advanced by the
 * repeat period and the same section / priority / labels / repeat rule. No-op
 * otherwise. Takes the record directly (not an id) so it never does a
 * read-after-write — the completion mutation already returns the row, and an
 * eventually-consistent re-read could miss it and silently skip the spawn. */
export async function spawnNextOccurrence(task: TaskRecord | null | undefined): Promise<void> {
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
