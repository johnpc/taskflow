/** Attachment (link) server state for a task — thin I/O over the Amplify
 * client. One bounded per-task GSI list, plus add/remove. */
import { dataClient, type AttachmentRecord } from '../../lib/dataClient';
import { membersForTask } from '../auth/members';

/** List a task's attachments, oldest first. */
export async function fetchAttachments(taskId: string): Promise<AttachmentRecord[]> {
  const { data } = await dataClient.models.Attachment.listAttachmentByTaskId(
    { taskId },
    { limit: 200 },
  );
  return ((data ?? []).filter(Boolean) as AttachmentRecord[]).sort((a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
  );
}

/** Attach a link to a task. The url is stored as given; render-time safeHref
 * guards it. A blank title falls back to the url in the UI. */
export async function addAttachment(input: {
  taskId: string;
  url: string;
  title: string;
}): Promise<AttachmentRecord> {
  const { data, errors } = await dataClient.models.Attachment.create({
    taskId: input.taskId,
    url: input.url.trim(),
    title: input.title.trim() || undefined,
    members: await membersForTask(input.taskId),
  });
  if (errors || !data) throw new Error(`Add attachment failed: ${JSON.stringify(errors)}`);
  return data;
}

/** Attach an uploaded FILE to a task: record its S3 key (resolved to a signed
 * URL at render) + the filename as the title. `url` holds a placeholder marker
 * (the model requires it) — a file attachment renders from storageKey. */
export async function addFileAttachment(input: {
  taskId: string;
  storageKey: string;
  title: string;
}): Promise<AttachmentRecord> {
  const { data, errors } = await dataClient.models.Attachment.create({
    taskId: input.taskId,
    url: `file:${input.storageKey}`,
    storageKey: input.storageKey,
    title: input.title.trim() || undefined,
    members: await membersForTask(input.taskId),
  });
  if (errors || !data) throw new Error(`Add file attachment failed: ${JSON.stringify(errors)}`);
  return data;
}

/** Remove an attachment by id. */
export async function removeAttachment(id: string): Promise<void> {
  const { errors } = await dataClient.models.Attachment.delete({ id });
  if (errors) throw new Error(`Remove attachment failed: ${JSON.stringify(errors)}`);
}
