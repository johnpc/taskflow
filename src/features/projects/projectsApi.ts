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

/** Update a project's editable header fields (name, description). */
export async function updateProject(
  input: { id: string } & Partial<Pick<ProjectRecord, 'name' | 'description'>>,
): Promise<void> {
  const { errors } = await dataClient.models.Project.update(input);
  if (errors) throw new Error(`Update project failed: ${JSON.stringify(errors)}`);
}

/** Archive a project — sets isArchived so it drops out of the project list
 * (fetchProjects filters archived) without deleting any of its data. */
export async function archiveProject(id: string): Promise<void> {
  const { errors } = await dataClient.models.Project.update({ id, isArchived: true });
  if (errors) throw new Error(`Archive project failed: ${JSON.stringify(errors)}`);
}

/** Permanently delete a project and everything under it. Deletes the project row
 * FIRST so it disappears from the list immediately (the mutation resolves fast),
 * then best-effort cleans up its now-orphaned sections + tasks + comments —
 * owner-scoped rows that surface nowhere without their project. */
export async function deleteProject(id: string): Promise<void> {
  const { errors } = await dataClient.models.Project.delete({ id });
  if (errors) throw new Error(`Delete project failed: ${JSON.stringify(errors)}`);
  // Best-effort child cleanup — never let it fail the delete (the project row is
  // already gone; orphaned owner-scoped children surface nowhere).
  await deleteProjectChildren(id).catch((e) => console.warn('Project child cleanup failed', e));
}

/** Best-effort removal of a deleted project's sections, tasks, and comments. */
async function deleteProjectChildren(projectId: string): Promise<void> {
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
