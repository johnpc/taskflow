/**
 * Labels server state — the owner's reusable tag registry. Thin I/O over the
 * Amplify client. A task stores denormalized labelIds[]; this registry maps each
 * id to a name + color for rendering chips.
 */
import { dataClient, type LabelRecord } from '../../lib/dataClient';

export type { LabelRecord } from '../../lib/dataClient';

/** All of the owner's labels (bounded — a small reference set), name-sorted. */
export async function fetchLabels(): Promise<LabelRecord[]> {
  const { data } = await dataClient.models.Label.list({ limit: 200 });
  return ((data ?? []).filter(Boolean) as LabelRecord[]).sort((a, b) =>
    (a.name ?? '').localeCompare(b.name ?? ''),
  );
}

/** Create a label with a name + color. */
export async function createLabel(input: { name: string; color: string }): Promise<LabelRecord> {
  const { data, errors } = await dataClient.models.Label.create({
    name: input.name.trim(),
    color: input.color,
  });
  if (errors || !data) throw new Error(`Create label failed: ${JSON.stringify(errors)}`);
  return data;
}
