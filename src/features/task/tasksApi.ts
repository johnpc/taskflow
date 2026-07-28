/**
 * Task server state — create / update / complete / move. Thin I/O over the
 * Amplify client; the pure status + due helpers live in taskMeta.
 */
import { dataClient, type TaskRecord } from '../../lib/dataClient';

export type { TaskRecord } from '../../lib/dataClient';

/** Create a task, appended to the end (highest sortOrder + 1). A board card
 * passes a sectionId; a subtask passes parentTaskId and omits the section. */
export async function createTask(input: {
  projectId: string;
  sectionId?: string;
  title: string;
  order: number;
  parentTaskId?: string;
}): Promise<TaskRecord> {
  const { data, errors } = await dataClient.models.Task.create({
    projectId: input.projectId,
    sectionId: input.sectionId || undefined,
    title: input.title.trim(),
    status: 'TODO',
    priority: 'NONE',
    sortOrder: input.order,
    parentTaskId: input.parentTaskId,
  });
  if (errors || !data) throw new Error(`Create task failed: ${JSON.stringify(errors)}`);
  return data;
}

/** Toggle a task done/undone. Completing stamps completedAt + DONE; reopening
 * clears it back to TODO. `now` is injected for deterministic tests. */
export async function setTaskDone(id: string, done: boolean, now: string): Promise<void> {
  const { errors } = await dataClient.models.Task.update({
    id,
    status: done ? 'DONE' : 'TODO',
    completedAt: done ? now : null,
  });
  if (errors) throw new Error(`Update task failed: ${JSON.stringify(errors)}`);
}

/** Patch arbitrary task fields (title, notes, priority, dueDate, assignee,
 * section/order for moves). */
export async function updateTask(
  input: { id: string } & Partial<
    Pick<
      TaskRecord,
      | 'title'
      | 'notes'
      | 'priority'
      | 'dueDate'
      | 'assigneeEmail'
      | 'sectionId'
      | 'sortOrder'
      | 'labelIds'
    >
  >,
): Promise<void> {
  const { errors } = await dataClient.models.Task.update(input);
  if (errors) throw new Error(`Update task failed: ${JSON.stringify(errors)}`);
}

/** Delete a task. */
export async function deleteTask(id: string): Promise<void> {
  const { errors } = await dataClient.models.Task.delete({ id });
  if (errors) throw new Error(`Delete task failed: ${JSON.stringify(errors)}`);
}
