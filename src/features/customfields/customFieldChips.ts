import { readCustomValues } from './customValues';
import type { CustomFieldRecord, TaskRecord } from '../../lib/dataClient';

/** A resolved custom-field chip to show on a card: the field name + the task's
 * value for it. Only fields that have a non-empty value on the task appear, in
 * the field definitions' order. Pure — the caller supplies the project's fields
 * and the task (whose customValues JSON string holds the values). */
export interface CustomFieldChip {
  id: string;
  name: string;
  value: string;
}

export function customFieldChips(
  task: Pick<TaskRecord, 'customValues'>,
  fields: CustomFieldRecord[],
): CustomFieldChip[] {
  const values = readCustomValues(task);
  return fields
    .filter((f) => !!values[f.id])
    .map((f) => ({ id: f.id, name: f.name, value: values[f.id] }));
}
