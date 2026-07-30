/**
 * Duplicate a whole project — a fresh copy with the same sections and its open,
 * top-level tasks (Asana "Duplicate project"). Thin I/O over the Amplify client;
 * what carries over lives in the pure duplicateProjectPlan helpers.
 */
import { dataClient, type ProjectRecord } from '../../lib/dataClient';
import { fetchBoard } from '../board/boardApi';
import { currentMembers } from '../auth/members';
import { nextProjectColor } from './projectColors';
import { copyTaskInput, tasksToCopy } from './duplicateProjectPlan';

/** Create a duplicate of `source`: a new project "<name> (copy)" with the same
 * color/view, its sections recreated in order, and its open top-level tasks
 * copied into the matching new sections. Returns the new project. */
export async function duplicateProject(
  source: ProjectRecord,
  existingCount: number,
): Promise<ProjectRecord> {
  const members = await currentMembers();
  const { data: project, errors } = await dataClient.models.Project.create({
    name: `${source.name} (copy)`,
    color: source.color ?? nextProjectColor(existingCount),
    view: source.view ?? 'BOARD',
    sortOrder: existingCount,
    isArchived: false,
    favorite: false,
    members,
  });
  if (errors || !project) throw new Error(`Duplicate project failed: ${JSON.stringify(errors)}`);

  const { sections, tasks } = await fetchBoard(source.id);
  // Recreate sections in order, mapping each old section id to its new one.
  const idMap = new Map<string, string>();
  for (const section of sections) {
    const { data } = await dataClient.models.Section.create({
      projectId: project.id,
      name: section.name,
      sortOrder: section.sortOrder ?? 0,
      members,
    });
    if (data) idMap.set(section.id, data.id);
  }
  // Copy open top-level tasks into their matching new sections.
  for (const task of tasksToCopy(tasks)) {
    const newSectionId = task.sectionId ? idMap.get(task.sectionId) : undefined;
    await dataClient.models.Task.create({
      ...copyTaskInput(task, project.id, newSectionId),
      members,
    });
  }
  return project;
}
