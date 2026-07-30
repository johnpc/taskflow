import { useState } from 'react';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** One custom-field row: a labelled text input holding its own edit state seeded
 * from the persisted value. Local state (not the prop) drives the input so an
 * eventually-consistent re-fetch right after saving can't blank what you typed;
 * the value commits on blur. */
export function CustomFieldRow({
  field,
  value,
  onSetValue,
}: {
  field: CustomFieldRecord;
  value: string;
  onSetValue: (fieldId: string, value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <label className="task-fields__row" data-testid="custom-field">
      <span className="task-fields__label">{field.name}</span>
      <input
        className="custom-fields__input"
        data-testid={`custom-field-input-${field.id}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== value && onSetValue(field.id, draft)}
      />
    </label>
  );
}
