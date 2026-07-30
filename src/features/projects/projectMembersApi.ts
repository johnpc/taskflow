import { dataClient } from '../../lib/dataClient';

/** Set a project's member list and cascade it to every record under the project
 * — sections, tasks, and each task's comments + attachments — so a newly-added
 * member can actually read the whole project (AppSync owner auth is per-record,
 * with no inheritance). Best-effort per child; the project update is what the UI
 * reflects. Emails are already normalized by the caller (see memberList). */
export async function setProjectMembers(projectId: string, members: string[]): Promise<void> {
  const { errors } = await dataClient.models.Project.update({ id: projectId, members });
  if (errors) throw new Error(`Update members failed: ${JSON.stringify(errors)}`);

  const [sections, tasks] = await Promise.all([
    dataClient.models.Section.listSectionByProjectIdAndSortOrder({ projectId }, { limit: 500 }),
    dataClient.models.Task.listTaskByProjectIdAndSortOrder({ projectId }, { limit: 1000 }),
  ]);
  const sectionRows = (sections.data ?? []).filter(Boolean) as { id: string }[];
  const taskRows = (tasks.data ?? []).filter(Boolean) as { id: string }[];

  await Promise.all(
    sectionRows.map((s) => dataClient.models.Section.update({ id: s.id, members })),
  );
  await Promise.all(
    taskRows.map(async (t) => {
      await dataClient.models.Task.update({ id: t.id, members });
      await cascadeTaskChildren(t.id, members);
    }),
  );
}

/** Mirror the member list onto a task's comments + attachments. */
async function cascadeTaskChildren(taskId: string, members: string[]): Promise<void> {
  const [comments, attachments] = await Promise.all([
    dataClient.models.Comment.listCommentByTaskId({ taskId }, { limit: 500 }),
    dataClient.models.Attachment.listAttachmentByTaskId({ taskId }, { limit: 500 }),
  ]);
  await Promise.all([
    ...((comments.data ?? []).filter(Boolean) as { id: string }[]).map((c) =>
      dataClient.models.Comment.update({ id: c.id, members }),
    ),
    ...((attachments.data ?? []).filter(Boolean) as { id: string }[]).map((a) =>
      dataClient.models.Attachment.update({ id: a.id, members }),
    ),
  ]);
}
