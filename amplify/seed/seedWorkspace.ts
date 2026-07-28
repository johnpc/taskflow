/** Seeds the demo workspace (projects → sections → tasks + subtasks). */
import { client, OWNER_WRITE } from './seedClient';
import { seedLabelData } from './seedLabels';
import { seedProjects, type SeedTask } from './fixtures/workspace';

/** Resolve a day offset (from today) to a YYYY-MM-DD date string. */
function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Map a task's label names to ids via the seeded registry (unknown dropped). */
function labelIdsFor(task: SeedTask, labelMap: Map<string, string>): string[] {
  return (task.labels ?? []).map((n) => labelMap.get(n)).filter((x): x is string => !!x);
}

/** Create one task (+ its subtasks) in a section. */
async function createTaskWithSubtasks(
  projectId: string,
  sectionId: string,
  task: SeedTask,
  order: number,
  labelMap: Map<string, string>,
): Promise<void> {
  const { data: created, errors } = await client.models.Task.create(
    {
      projectId,
      sectionId,
      title: task.title,
      notes: task.notes,
      status: 'TODO',
      priority: task.priority,
      dueDate: task.dueOffsetDays === undefined ? undefined : offsetDate(task.dueOffsetDays),
      sortOrder: order,
      labelIds: labelIdsFor(task, labelMap),
    },
    OWNER_WRITE,
  );
  if (errors || !created) throw new Error(`Task ${task.title}: ${JSON.stringify(errors)}`);
  const subs = task.subtasks ?? [];
  for (let i = 0; i < subs.length; i++) {
    await client.models.Task.create(
      {
        projectId,
        parentTaskId: created.id,
        title: subs[i],
        status: 'TODO',
        priority: 'NONE',
        sortOrder: i,
      },
      OWNER_WRITE,
    );
  }
}

/** Create every seed project with its sections + tasks. Returns project count. */
export async function seedWorkspaceData(): Promise<number> {
  const labelMap = await seedLabelData();
  for (let p = 0; p < seedProjects.length; p++) {
    const proj = seedProjects[p];
    const { data: project, errors } = await client.models.Project.create(
      {
        name: proj.name,
        color: proj.color,
        view: 'BOARD',
        sortOrder: p,
        isArchived: false,
        favorite: !!proj.favorite,
      },
      OWNER_WRITE,
    );
    if (errors || !project) throw new Error(`Project ${proj.name}: ${JSON.stringify(errors)}`);

    const sectionIds = new Map<string, string>();
    for (let s = 0; s < proj.sections.length; s++) {
      const { data: section } = await client.models.Section.create(
        { projectId: project.id, name: proj.sections[s], sortOrder: s },
        OWNER_WRITE,
      );
      if (section) sectionIds.set(proj.sections[s], section.id);
    }

    for (let t = 0; t < proj.tasks.length; t++) {
      const task = proj.tasks[t];
      const sectionId = sectionIds.get(task.section);
      if (sectionId) await createTaskWithSubtasks(project.id, sectionId, task, t, labelMap);
    }
  }
  console.log(`Seeded ${seedProjects.length} projects.`);
  return seedProjects.length;
}
