/** Instantiate a project from a template: create the project, its sections, and
 * its starter tasks. Thin I/O over the Amplify client; returns the new id. */
import { dataClient } from '../../lib/dataClient';
import { currentMembers } from '../auth/members';
import type { ProjectTemplate } from './templateCatalog';

export async function createFromTemplate(
  template: ProjectTemplate,
  sortOrder: number,
): Promise<string> {
  // A fresh project: the creator is the sole member, reused for every child.
  const members = await currentMembers();
  const { data: project, errors } = await dataClient.models.Project.create({
    name: template.name,
    color: template.color,
    description: template.description,
    view: 'BOARD',
    sortOrder,
    isArchived: false,
    favorite: false,
    members,
  });
  if (errors || !project) throw new Error(`Create from template failed: ${JSON.stringify(errors)}`);

  const sectionIds = new Map<string, string>();
  for (let i = 0; i < template.sections.length; i++) {
    const { data: section } = await dataClient.models.Section.create({
      projectId: project.id,
      name: template.sections[i],
      sortOrder: i,
      members,
    });
    if (section) sectionIds.set(template.sections[i], section.id);
  }

  for (let i = 0; i < template.tasks.length; i++) {
    const t = template.tasks[i];
    await dataClient.models.Task.create({
      projectId: project.id,
      sectionId: sectionIds.get(t.section),
      title: t.title,
      status: 'TODO',
      priority: 'NONE',
      sortOrder: i,
      members,
    });
  }
  return project.id;
}
