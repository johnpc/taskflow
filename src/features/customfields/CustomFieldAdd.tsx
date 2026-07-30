import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { FIELD_TYPE_LABEL, type FieldType } from './fieldType';

export type { FieldType } from './fieldType';

export interface NewField {
  name: string;
  fieldType: FieldType;
  options?: string[];
}

const TYPES = Object.entries(FIELD_TYPE_LABEL) as [FieldType, string][];

/** The "add a custom field" composer: a name, a type toggle (Text / Select /
 * Number / Date), and — for Select — a comma-separated options input. Local
 * state only; commits the new field on Enter / the Add button. */
export function CustomFieldAdd({ onAdd }: { onAdd: (field: NewField) => void }) {
  const [name, setName] = useState('');
  const [fieldType, setType] = useState<FieldType>('TEXT');
  const [options, setOptions] = useState('');

  const commit = () => {
    if (!name.trim()) return;
    const opts = options
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    onAdd({ name, fieldType, options: fieldType === 'SELECT' ? opts : undefined });
    setName('');
    setOptions('');
    setType('TEXT');
  };

  return (
    <div className="custom-fields__add">
      <IonIcon icon={addOutline} aria-hidden="true" />
      <input
        className="custom-fields__name"
        data-testid="custom-field-name"
        placeholder="Add a field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && fieldType === 'TEXT' && commit()}
      />
      <select
        className="custom-fields__type"
        data-testid="custom-field-type"
        value={fieldType}
        onChange={(e) => setType(e.target.value as FieldType)}
      >
        {TYPES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {fieldType === 'SELECT' && (
        <input
          className="custom-fields__name"
          data-testid="custom-field-options"
          placeholder="Options (comma-separated)"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
      )}
      <button type="button" data-testid="custom-field-add" onClick={commit}>
        Add
      </button>
    </div>
  );
}
