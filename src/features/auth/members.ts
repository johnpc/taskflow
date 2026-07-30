import { currentEmail } from './authClient';
import { dataClient } from '../../lib/dataClient';

/** The initial `members` list for a newly-created PROJECT: just the creator's
 * email. Every project-scoped model authorizes via ownersDefinedIn('members'),
 * so the creator must be in the list or they'd lose access to their own row.
 * Invites append to this later. */
export async function currentMembers(): Promise<string[]> {
  const email = await currentEmail();
  return email ? [email] : [];
}

/** The `members` list a project-child record (section/task) should carry: a copy
 * of its project's members, so every collaborator on the project can read/write
 * it. Falls back to the creator's own email if the project can't be read. */
export async function membersForProject(projectId: string): Promise<string[]> {
  try {
    const { data } = await dataClient.models.Project.get({ id: projectId });
    const members = (data?.members ?? []).filter((m): m is string => !!m);
    if (members.length > 0) return members;
  } catch {
    /* fall through to the creator-only default */
  }
  return currentMembers();
}

/** The `members` list a task-child record (comment/attachment) should carry: a
 * copy of its task's members, so a collaborator's comment/link is visible to
 * everyone on the task. Falls back to the creator's own email. */
export async function membersForTask(taskId: string): Promise<string[]> {
  try {
    const { data } = await dataClient.models.Task.get({ id: taskId });
    const members = (data?.members ?? []).filter((m): m is string => !!m);
    if (members.length > 0) return members;
  } catch {
    /* fall through to the creator-only default */
  }
  return currentMembers();
}
