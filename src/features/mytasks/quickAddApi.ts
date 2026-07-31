/**
 * Quick-add a task from My Tasks into a chosen project. Resolves the project's
 * first section (board tasks need one to appear) then creates the task there,
 * appended after the current last. Thin I/O over the Amplify client.
 */
import { dataClient } from '../../lib/dataClient';
import { createTask } from '../task/tasksApi';

/** Create a task titled `title` in `projectId`'s first section (ordered),
 * appended at the end. Falls back to no section if the project has none. */
export async function quickAddTask(projectId: string, title: string): Promise<void> {
  const [sectionsRes, tasksRes] = await Promise.all([
    dataClient.models.Section.listSectionByProjectIdAndSortOrder({ projectId }, { limit: 1 }),
    dataClient.models.Task.listTaskByProjectIdAndSortOrder({ projectId }, { limit: 1000 }),
  ]);
  const sectionId = (sectionsRes.data ?? []).filter(Boolean)[0]?.id;
  const order = (tasksRes.data ?? []).filter(Boolean).length;
  await createTask({ projectId, sectionId, title, order });
}
