import { useState } from 'react';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** One custom-field row. A SELECT field renders a dropdown of its options
 * (commits immediately on change); a TEXT field renders an input holding its own
 * draft (so an eventually-consistent re-fetch post-save can't blank what you
 * typed) that commits on blur. */
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
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && onSetValue(field.id, draft)}
        />
      )}
    </label>
  );
}
