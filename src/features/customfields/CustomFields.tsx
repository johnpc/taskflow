import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { CustomFieldRow } from './CustomFieldRow';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** Task-detail custom fields: one text input per project-defined field (value
 * from the task's customValues map), plus an inline "add field" composer.
 * Presentational — value edits + field creation are delegated up. */
export function CustomFields({
  fields,
  values,
  onSetValue,
  onAddField,
}: {
  fields: CustomFieldRecord[];
  values: Record<string, string>;
  onSetValue: (fieldId: string, value: string) => void;
  onAddField: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const addField = () => {
    if (name.trim()) onAddField(name);
    setName('');
  };

  return (
    <section className="custom-fields" data-testid="custom-fields">
      <h2 className="subtasks__head">Custom fields</h2>
      {fields.map((f) => (
        <CustomFieldRow key={f.id} field={f} value={values[f.id] ?? ''} onSetValue={onSetValue} />
      ))}
      <div className="custom-fields__add">
        <IonIcon icon={addOutline} aria-hidden="true" />
        <input
          className="custom-fields__name"
          data-testid="custom-field-name"
          placeholder="Add a field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addField()}
        />
      </div>
    </section>
  );
}
