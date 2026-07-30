import { dataClient } from '../../lib/dataClient';

/** Best-effort removal of a deleted project's sections, tasks, and comments —
 * the now-orphaned member-scoped rows that surface nowhere without their
 * project. Called after the project row itself is deleted; never throws into the
 * delete path (the project is already gone). */
export async function deleteProjectChildren(projectId: string): Promise<void> {
  const [sections, tasks] = await Promise.all([
    dataClient.models.Section.listSectionByProjectIdAndSortOrder({ projectId }, { limit: 500 }),
    dataClient.models.Task.listTaskByProjectIdAndSortOrder({ projectId }, { limit: 1000 }),
  ]);
  const taskRows = (tasks.data ?? []).filter(Boolean) as { id: string }[];
  await Promise.all(
    taskRows.map(async (t) => {
      const { data: comments } = await dataClient.models.Comment.listCommentByTaskId({
        taskId: t.id,
      });
      await Promise.all(
        (comments ?? [])
          .filter(Boolean)
          .map((c) => dataClient.models.Comment.delete({ id: c!.id })),
      );
      await dataClient.models.Task.delete({ id: t.id });
    }),
  );
  await Promise.all(
    ((sections.data ?? []).filter(Boolean) as { id: string }[]).map((s) =>
      dataClient.models.Section.delete({ id: s.id }),
    ),
  );
}
