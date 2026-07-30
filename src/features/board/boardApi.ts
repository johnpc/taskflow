/**
 * Board server state — the sections + tasks of one project. Thin I/O; grouping
 * lives in taskGrouping. A project's sections and tasks are each a bounded
 * per-project GSI query, shaped into columns client-side.
 */
import { dataClient, type SectionRecord, type TaskRecord } from '../../lib/dataClient';
import { membersForProject } from '../auth/members';

export interface BoardData {
  sections: SectionRecord[];
  tasks: TaskRecord[];
}

/** Load a project's sections (ordered) + all its tasks. */
export async function fetchBoard(projectId: string): Promise<BoardData> {
  const [sectionsRes, tasksRes] = await Promise.all([
    dataClient.models.Section.listSectionByProjectIdAndSortOrder({ projectId }, { limit: 200 }),
    dataClient.models.Task.listTaskByProjectIdAndSortOrder({ projectId }, { limit: 1000 }),
  ]);
  const sections = (sectionsRes.data ?? []).filter(Boolean) as SectionRecord[];
  const tasks = (tasksRes.data ?? []).filter(Boolean) as TaskRecord[];
  return { sections, tasks };
}

/** Ensure a project has at least the default columns; create them if missing.
 * Returns the sections (existing or freshly created), ordered. */
export async function ensureDefaultSections(
  projectId: string,
  existing: SectionRecord[],
): Promise<SectionRecord[]> {
  if (existing.length > 0) return existing;
  const defaults = ['To do', 'In progress', 'Done'];
  const members = await membersForProject(projectId);
  const created: SectionRecord[] = [];
  for (let i = 0; i < defaults.length; i++) {
    const { data } = await dataClient.models.Section.create({
      projectId,
      name: defaults[i],
      sortOrder: i,
      members,
    });
    if (data) created.push(data);
  }
  return created;
}
