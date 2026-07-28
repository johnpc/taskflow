/** Seeds the reusable label registry, returning a name→id map so tasks can be
 * tagged by label name in the workspace fixture. */
import { client, OWNER_WRITE } from './seedClient';
import { seedLabels } from './fixtures/workspace';

export async function seedLabelData(): Promise<Map<string, string>> {
  const byName = new Map<string, string>();
  for (const label of seedLabels) {
    const { data, errors } = await client.models.Label.create(
      { name: label.name, color: label.color },
      OWNER_WRITE,
    );
    if (errors || !data) throw new Error(`Label ${label.name}: ${JSON.stringify(errors)}`);
    byName.set(label.name, data.id);
  }
  console.log(`Seeded ${byName.size} labels.`);
  return byName;
}
