/**
 * Projects server state — the workspace's project registry. Thin I/O over the
 * Amplify client; ordering/shaping lives in pure helpers so this stays short.
 */
import { dataClient, type ProjectRecord } from '../../lib/dataClient';
import { nextProjectColor } from './projectColors';
import { sortProjects } from './sortProjects';

export type { ProjectRecord } from '../../lib/dataClient';

/** All of the owner's non-archived projects, favorites first then by sortOrder. */
export async function fetchProjects(): Promise<ProjectRecord[]> {
  const { data } = await dataClient.models.Project.list({ limit: 200 });
  return sortProjects((data ?? []).filter((p) => !!p && !p.isArchived) as ProjectRecord[]);
}

/** Fetch a single project by id (project header + view). */
export async function fetchProject(id: string): Promise<ProjectRecord | null> {
  const { data } = await dataClient.models.Project.get({ id });
  return data ?? null;
}

/** Create a project with an auto-assigned color + next sortOrder. */
export async function createProject(input: {
  name: string;
  existingCount: number;
}): Promise<ProjectRecord> {
  const { data, errors } = await dataClient.models.Project.create({
    name: input.name.trim(),
    color: nextProjectColor(input.existingCount),
    view: 'BOARD',
    sortOrder: input.existingCount,
    isArchived: false,
    favorite: false,
  });
  if (errors || !data) throw new Error(`Create project failed: ${JSON.stringify(errors)}`);
  return data;
}

/** Toggle a project's favorite flag. */
export async function setProjectFavorite(id: string, favorite: boolean): Promise<void> {
  const { errors } = await dataClient.models.Project.update({ id, favorite });
  if (errors) throw new Error(`Update project failed: ${JSON.stringify(errors)}`);
}
