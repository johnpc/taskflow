/** Archived-projects server state — list the owner's archived projects and
 * restore one. Kept separate from projectsApi so that file stays short. */
import { dataClient, type ProjectRecord } from '../../lib/dataClient';
import { sortProjects } from './sortProjects';

/** The owner's ARCHIVED projects, ordered like the main list. */
export async function fetchArchivedProjects(): Promise<ProjectRecord[]> {
  const { data } = await dataClient.models.Project.list({ limit: 200 });
  return sortProjects((data ?? []).filter((p) => !!p && p.isArchived) as ProjectRecord[]);
}

/** Restore an archived project back to the active list. */
export async function unarchiveProject(id: string): Promise<void> {
  const { errors } = await dataClient.models.Project.update({ id, isArchived: false });
  if (errors) throw new Error(`Restore project failed: ${JSON.stringify(errors)}`);
}
