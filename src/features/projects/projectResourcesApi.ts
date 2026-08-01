/**
 * Project "key resources" — named links shown on the project overview (Asana's
 * Overview key-resources list). Thin I/O over the Amplify client: one bounded
 * per-project GSI read plus create/delete. Member-scoped like the project.
 */
import { dataClient, type ProjectResourceRecord } from '../../lib/dataClient';
import { membersForProject } from '../auth/members';

/** List a project's key resources, oldest first (creation order). */
export async function fetchResources(projectId: string): Promise<ProjectResourceRecord[]> {
  const { data } = await dataClient.models.ProjectResource.listProjectResourceByProjectId(
    { projectId },
    { limit: 200 },
  );
  return ((data ?? []).filter(Boolean) as ProjectResourceRecord[]).sort((a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
  );
}

/** Add a key-resource link to a project. */
export async function addResource(input: {
  projectId: string;
  title: string;
  url: string;
}): Promise<ProjectResourceRecord> {
  const { data, errors } = await dataClient.models.ProjectResource.create({
    projectId: input.projectId,
    title: input.title.trim(),
    url: input.url.trim(),
    members: await membersForProject(input.projectId),
  });
  if (errors || !data) throw new Error(`Add resource failed: ${JSON.stringify(errors)}`);
  return data;
}

/** Remove a key-resource link. */
export async function removeResource(id: string): Promise<void> {
  const { errors } = await dataClient.models.ProjectResource.delete({ id });
  if (errors) throw new Error(`Remove resource failed: ${JSON.stringify(errors)}`);
}
