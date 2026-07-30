import type { TaskRecord } from '../../lib/dataClient';

/** A task's custom-field values as a plain string map. `customValues` is stored
 * as a JSON STRING (see the schema note), so parse + normalize to string→string,
 * dropping non-string values and tolerating null/blank/bad JSON. Pure + total. */
export function readCustomValues(task: Pick<TaskRecord, 'customValues'>): Record<string, string> {
  const raw = task.customValues;
  if (!raw || typeof raw !== 'string') return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

/** Return a new values map with `fieldId` set to `value` (or removed when the
 * value is blank, so cleared fields don't linger). Pure. */
export function setCustomValue(
  values: Record<string, string>,
  fieldId: string,
  value: string,
): Record<string, string> {
  const next = { ...values };
  if (value.trim()) next[fieldId] = value;
  else delete next[fieldId];
  return next;
}

/** Serialize a values map to the stored JSON string. */
export function serializeCustomValues(values: Record<string, string>): string {
  return JSON.stringify(values);
}
