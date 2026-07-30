import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

export interface NewField {
  name: string;
  fieldType: 'TEXT' | 'SELECT';
  options?: string[];
}

/** The "add a custom field" composer: a name, a type toggle (Text / Select),
 * and — for Select — a comma-separated options input. Local state only; commits
 * the new field on Enter / the Add button. */
export function CustomFieldAdd({ onAdd }: { onAdd: (field: NewField) => void }) {
  const [name, setName] = useState('');
  const [fieldType, setType] = useState<'TEXT' | 'SELECT'>('TEXT');
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
        onChange={(e) => setType(e.target.value as 'TEXT' | 'SELECT')}
      >
        <option value="TEXT">Text</option>
        <option value="SELECT">Select</option>
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
