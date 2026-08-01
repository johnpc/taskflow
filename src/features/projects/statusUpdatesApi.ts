/**
 * Project status-update history (Asana status updates). A dated entry captures
 * the project's health + a note at that moment; posting one also sets the
 * project's current status/statusNote (the header pill). Thin I/O; one bounded
 * per-project GSI read, sorted newest-first.
 */
import { dataClient, type StatusUpdateRecord } from '../../lib/dataClient';
import { updateProject } from './projectsApi';
import { membersForProject } from '../auth/members';
import type { ProjectStatus } from './projectStatus';

/** List a project's status updates, newest first. */
export async function fetchStatusUpdates(projectId: string): Promise<StatusUpdateRecord[]> {
  const { data } = await dataClient.models.StatusUpdate.listStatusUpdateByProjectId(
    { projectId },
    { limit: 200 },
  );
  return ((data ?? []).filter(Boolean) as StatusUpdateRecord[]).sort((a, b) =>
    (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
  );
}

/** Post a status update and set the project's current status + note to match. */
export async function postStatusUpdate(input: {
  projectId: string;
  status: ProjectStatus;
  note: string;
  authorEmail: string | null;
}): Promise<StatusUpdateRecord> {
  const { data, errors } = await dataClient.models.StatusUpdate.create({
    projectId: input.projectId,
    status: input.status,
    note: input.note.trim() || undefined,
    authorEmail: input.authorEmail ?? undefined,
    members: await membersForProject(input.projectId),
  });
  if (errors || !data) throw new Error(`Post status failed: ${JSON.stringify(errors)}`);
  await updateProject({ id: input.projectId, status: input.status, statusNote: input.note.trim() });
  return data;
}
