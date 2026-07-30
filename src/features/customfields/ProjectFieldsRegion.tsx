import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward, optionsOutline } from 'ionicons/icons';
import { CustomFieldAdd } from './CustomFieldAdd';
import { useCustomFields } from './useCustomFields';
import { FIELD_TYPE_LABEL } from './fieldType';
import './customFields.css';

/** Project-level custom-fields manager, surfaced on the board so you can define
 * project columns (name + type) without opening a task. Collapsible; lists the
 * defined fields with their type, plus the add composer. Field VALUES are still
 * filled per task on task detail. */
export function ProjectFieldsRegion({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const { fields, add } = useCustomFields(projectId);
  return (
    <section className="project-fields" data-testid="project-fields">
      <button
        type="button"
        className="project-fields__head"
        data-testid="project-fields-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <IonIcon icon={optionsOutline} aria-hidden="true" />
        <span>Custom fields</span>
        <span className="project-fields__count">{fields.length}</span>
      </button>
      {open && (
        <div className="project-fields__body">
          {fields.length === 0 && (
            <p className="project-fields__empty">
              No custom fields yet. Add one below — it becomes a field on every task in this
              project.
            </p>
          )}
          <ul className="project-fields__list">
            {fields.map((f) => (
              <li key={f.id} className="project-fields__item" data-testid="project-field">
                <span className="project-fields__name">{f.name}</span>
                <span className="project-fields__type">
                  {FIELD_TYPE_LABEL[f.fieldType ?? 'TEXT']}
                </span>
              </li>
            ))}
          </ul>
          <CustomFieldAdd onAdd={(field) => add.mutate(field)} />
        </div>
      )}
    </section>
  );
}
