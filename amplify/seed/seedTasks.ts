/** Task-level seed helpers: create a task with its subtasks, and resolve
 * same-project blockedBy references in a follow-up pass. Split from
 * seedWorkspace so each file stays small. */
import { client, OWNER_WRITE } from './seedClient';
import { type SeedTask } from './fixtures/workspace';
import { subtaskFields, taskCreateFields } from './seedTaskFields';

/** Create one task (+ its subtasks) in a section. Returns the new task id so
 * the caller can resolve same-project blockedBy references afterward. */
export async function createTaskWithSubtasks(
  projectId: string,
  sectionId: string,
  task: SeedTask,
  order: number,
  labelMap: Map<string, string>,
  members: string[],
): Promise<string> {
  const { data: created, errors } = await client.models.Task.create(
    { projectId, sectionId, ...taskCreateFields(task, order, labelMap, members), members },
    OWNER_WRITE,
  );
  if (errors || !created) throw new Error(`Task ${task.title}: ${JSON.stringify(errors)}`);
  const subs = task.subtasks ?? [];
  for (let i = 0; i < subs.length; i++) {
    await client.models.Task.create(
      {
        projectId,
        parentTaskId: created.id,
        ...subtaskFields(subs[i], members),
        status: 'TODO',
        priority: 'NONE',
        sortOrder: i,
        members,
      },
      OWNER_WRITE,
    );
  }
  return created.id;
}

/** Second pass: resolve each task's blockedBy titles to ids (same project) and
 * patch blockedByIds. Runs after all of a project's tasks exist. */
export async function linkBlockers(tasks: SeedTask[], taskIds: Map<string, string>): Promise<void> {
  for (const task of tasks) {
    const ids = (task.blockedBy ?? [])
      .map((title) => taskIds.get(title))
      .filter((x): x is string => !!x);
    const id = taskIds.get(task.title);
    if (id && ids.length > 0) {
      await client.models.Task.update({ id, blockedByIds: ids }, OWNER_WRITE);
    }
  }
}
