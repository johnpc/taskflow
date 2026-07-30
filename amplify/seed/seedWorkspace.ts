/** Seeds the demo workspace (projects → sections → tasks + subtasks). */
import { client, OWNER_WRITE, seedMembers } from './seedClient';
import { seedLabelData } from './seedLabels';
import { seedProjects } from './fixtures/workspace';
import { createTaskWithSubtasks, linkBlockers } from './seedTasks';

/** Create every seed project with its sections + tasks. Returns project count. */
export async function seedWorkspaceData(): Promise<number> {
  const labelMap = await seedLabelData();
  const members = seedMembers();
  for (let p = 0; p < seedProjects.length; p++) {
    const proj = seedProjects[p];
    const { data: project, errors } = await client.models.Project.create(
      {
        name: proj.name,
        color: proj.color,
        view: 'BOARD',
        sortOrder: p,
        isArchived: !!proj.archived,
        favorite: !!proj.favorite,
        members,
      },
      OWNER_WRITE,
    );
    if (errors || !project) throw new Error(`Project ${proj.name}: ${JSON.stringify(errors)}`);

    const sectionIds = new Map<string, string>();
    for (let s = 0; s < proj.sections.length; s++) {
      const { data: section } = await client.models.Section.create(
        { projectId: project.id, name: proj.sections[s], sortOrder: s, members },
        OWNER_WRITE,
      );
      if (section) sectionIds.set(proj.sections[s], section.id);
    }

    const taskIds = new Map<string, string>();
    for (let t = 0; t < proj.tasks.length; t++) {
      const task = proj.tasks[t];
      const sectionId = sectionIds.get(task.section);
      if (sectionId) {
        const id = await createTaskWithSubtasks(project.id, sectionId, task, t, labelMap, members);
        taskIds.set(task.title, id);
      }
    }
    await linkBlockers(proj.tasks, taskIds);
  }
  console.log(`Seeded ${seedProjects.length} projects.`);
  return seedProjects.length;
}
