/** Custom-field server state — the per-project field definitions. Thin I/O over
 * the Amplify client; one bounded per-project GSI read + create. */
import { dataClient, type CustomFieldRecord } from '../../lib/dataClient';
import { membersForProject } from '../auth/members';

export type { CustomFieldRecord } from '../../lib/dataClient';

/** List a project's custom fields, ordered by sortOrder then creation. */
export async function fetchCustomFields(projectId: string): Promise<CustomFieldRecord[]> {
  const { data } = await dataClient.models.CustomField.listCustomFieldByProjectId(
    { projectId },
    { limit: 200 },
  );
  return ((data ?? []).filter(Boolean) as CustomFieldRecord[]).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

/** Create a custom field (TEXT or SELECT) on a project, appended after the
 * current last. SELECT fields carry their allowed option labels. */
export async function createCustomField(input: {
  projectId: string;
  name: string;
  order: number;
  fieldType?: 'TEXT' | 'SELECT';
  options?: string[];
}): Promise<CustomFieldRecord> {
  const { data, errors } = await dataClient.models.CustomField.create({
    projectId: input.projectId,
    name: input.name.trim(),
    fieldType: input.fieldType ?? 'TEXT',
    options: input.options?.map((o) => o.trim()).filter(Boolean),
    sortOrder: input.order,
    members: await membersForProject(input.projectId),
  });
  if (errors || !data) throw new Error(`Create custom field failed: ${JSON.stringify(errors)}`);
  return data;
}
