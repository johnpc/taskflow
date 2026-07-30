/**
 * Duplicate a section within a project — a new "<name> (copy)" placed right
 * after the source, with the source's open, top-level tasks copied in. Thin I/O;
 * reuses the project-duplication task-copy plan. */
import { dataClient, type SectionRecord } from '../../lib/dataClient';
import { fetchBoard } from './boardApi';
import { membersForProject } from '../auth/members';
import { copyTaskInput, tasksToCopy } from '../projects/duplicateProjectPlan';

/** Create a copy of `section`: a new section named "<name> (copy)" at the next
 * sort order, carrying the source's open top-level tasks. Returns the new
 * section. */
export async function duplicateSection(section: SectionRecord): Promise<SectionRecord> {
  const members = await membersForProject(section.projectId);
  const { data: created, errors } = await dataClient.models.Section.create({
    projectId: section.projectId,
    name: `${section.name} (copy)`,
    sortOrder: (section.sortOrder ?? 0) + 1,
    members,
  });
  if (errors || !created) throw new Error(`Duplicate section failed: ${JSON.stringify(errors)}`);

  const { tasks } = await fetchBoard(section.projectId);
  const own = tasksToCopy(tasks).filter((t) => t.sectionId === section.id);
  for (const task of own) {
    await dataClient.models.Task.create({
      ...copyTaskInput(task, section.projectId, created.id),
      members,
    });
  }
  return created;
}
