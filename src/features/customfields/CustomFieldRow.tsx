import { useState } from 'react';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** HTML input type for a value-entry field type. */
const INPUT_TYPE: Record<string, string> = { NUMBER: 'number', DATE: 'date' };

/** One custom-field row. SELECT renders a dropdown of its options (commits on
 * change); TEXT / NUMBER / DATE render an input of the matching HTML type,
 * holding its own draft (so an eventually-consistent re-fetch post-save can't
 * blank what you typed) that commits on blur. Values are stored as strings. */
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
  const options = (field.options ?? []).filter((o): o is string => !!o);

  return (
    <label className="task-fields__row" data-testid="custom-field">
      <span className="task-fields__label">{field.name}</span>
      {field.fieldType === 'SELECT' ? (
        <select
          className="custom-fields__input"
          data-testid={`custom-field-input-${field.id}`}
          value={value}
          onChange={(e) => onSetValue(field.id, e.target.value)}
        >
          <option value="">—</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="custom-fields__input"
          data-testid={`custom-field-input-${field.id}`}
          type={INPUT_TYPE[field.fieldType ?? 'TEXT'] ?? 'text'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && onSetValue(field.id, draft)}
        />
      )}
    </label>
  );
}
