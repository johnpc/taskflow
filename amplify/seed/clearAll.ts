/** Wipes every owner-scoped model so a re-seed converges to a known state. */
import { client, clearOneModel } from './seedClient';

/** Clear all models. Comments + subtasks reference Tasks; Tasks reference
 * Sections/Projects — but delete is by id (no cascade needed), so order only
 * matters for readability. The seed runs as the owner, clearing that user's own
 * rows so the shared e2e account never accumulates state. */
export async function clearAll(): Promise<void> {
  await clearOneModel(client.models.Comment);
  await clearOneModel(client.models.Task);
  await clearOneModel(client.models.Section);
  await clearOneModel(client.models.Project);
  await clearOneModel(client.models.Label);
  // (Label cleared above — kept explicit so a new model isn't silently missed.)
}
