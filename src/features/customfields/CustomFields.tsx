import { CustomFieldRow } from './CustomFieldRow';
import { CustomFieldAdd, type NewField } from './CustomFieldAdd';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** Task-detail custom fields: an editable row per project-defined field (text
 * input or select), plus an inline "add field" composer. Presentational —
 * value edits + field creation are delegated up. */
export function CustomFields({
  fields,
  values,
  onSetValue,
  onAddField,
}: {
  fields: CustomFieldRecord[];
  values: Record<string, string>;
  onSetValue: (fieldId: string, value: string) => void;
  onAddField: (field: NewField) => void;
}) {
  return (
    <section className="custom-fields" data-testid="custom-fields">
      <h2 className="subtasks__head">Custom fields</h2>
      {fields.map((f) => (
        <CustomFieldRow key={f.id} field={f} value={values[f.id] ?? ''} onSetValue={onSetValue} />
      ))}
      <CustomFieldAdd onAdd={onAddField} />
    </section>
  );
}
