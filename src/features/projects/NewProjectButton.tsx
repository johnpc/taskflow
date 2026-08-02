import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

/** Inline project composer: a "New project" button that expands into a name
 * field. Submits on Enter / the Add button, cancels on Escape / blur-empty.
 * Presentational + local state only; creation is delegated via onCreate. */
export function NewProjectButton({
  onCreate,
  busy,
}: {
  onCreate: (name: string) => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setOpen(false);
    onCreate(trimmed);
    setName('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="project-new"
        data-testid="new-project"
        onClick={() => setOpen(true)}
      >
        <IonIcon icon={addOutline} aria-hidden="true" />
        <span>New project</span>
      </button>
    );
  }

  return (
    <div className="project-new project-new--open">
      <IonIcon icon={addOutline} className="project-new__icon" aria-hidden="true" />
      <input
        className="project-new__input"
        data-testid="new-project-input"
        placeholder="Name your new project"
        value={name}
        autoFocus
        disabled={busy}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      <button
        type="button"
        className="project-new__add"
        data-testid="new-project-add"
        disabled={busy}
        onClick={submit}
      >
        Add
      </button>
    </div>
  );
}
