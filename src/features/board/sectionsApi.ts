/** Section mutations — add / rename / delete columns within a project. Thin I/O
 * over the Amplify client; the board query re-reads sections after each change. */
import { dataClient } from '../../lib/dataClient';

/** Create a section appended after the current last (highest sortOrder + 1). */
export async function createSection(input: {
  projectId: string;
  name: string;
  order: number;
}): Promise<void> {
  const { errors } = await dataClient.models.Section.create({
    projectId: input.projectId,
    name: input.name.trim(),
    sortOrder: input.order,
  });
  if (errors) throw new Error(`Create section failed: ${JSON.stringify(errors)}`);
}

/** Rename a section. */
export async function renameSection(id: string, name: string): Promise<void> {
  const { errors } = await dataClient.models.Section.update({ id, name: name.trim() });
  if (errors) throw new Error(`Rename section failed: ${JSON.stringify(errors)}`);
}

/** Delete a section. Tasks that referenced it fall back to the first column on
 * the next board read (groupTasksBySection drops orphans onto column 0). */
export async function deleteSection(id: string): Promise<void> {
  const { errors } = await dataClient.models.Section.delete({ id });
  if (errors) throw new Error(`Delete section failed: ${JSON.stringify(errors)}`);
}
