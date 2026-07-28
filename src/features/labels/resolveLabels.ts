import type { LabelRecord } from '../../lib/dataClient';

/** Resolve a task's denormalized labelIds[] to the matching label records, in a
 * stable order (by the label registry's order). Unknown ids are dropped. Pure so
 * chip rendering is deterministic + testable. */
export function resolveLabels(
  labelIds: (string | null)[] | null | undefined,
  registry: LabelRecord[],
): LabelRecord[] {
  const ids = new Set((labelIds ?? []).filter((x): x is string => !!x));
  return registry.filter((label) => ids.has(label.id));
}

/** Toggle a label id within a task's labelIds set, returning the new array. */
export function toggleLabelId(
  labelIds: (string | null)[] | null | undefined,
  id: string,
): string[] {
  const set = new Set((labelIds ?? []).filter((x): x is string => !!x));
  if (set.has(id)) set.delete(id);
  else set.add(id);
  return [...set];
}
