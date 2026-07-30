import { dataClient, type TaskRecord } from '../../lib/dataClient';
import { updateTask } from './tasksApi';

/** Promote a subtask to a standalone task: clear its parent and drop it into its
 * project's first section (ordered) so it surfaces on the board — subtasks carry
 * no section. Falls back to no section if the project has none. */
export async function promoteSubtask(task: TaskRecord): Promise<void> {
  const { data } = await dataClient.models.Section.listSectionByProjectIdAndSortOrder(
    { projectId: task.projectId },
    { limit: 1 },
  );
  const sectionId = (data ?? []).filter(Boolean)[0]?.id;
  await updateTask({ id: task.id, parentTaskId: null, sectionId });
}
