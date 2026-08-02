import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

/** Inline "add a task" composer for a board column. Expands into a title input;
 * Enter or Add submits, Escape cancels. Local state only; creation delegated. */
export function AddCard({ onAdd, busy }: { onAdd: (title: string) => void; busy: boolean }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return setOpen(false);
    onAdd(trimmed);
    setTitle('');
    // Keep open so several cards can be added in a row.
  };

  if (!open) {
    return (
      <button
        type="button"
        className="add-card"
        data-testid="add-card"
        onClick={() => setOpen(true)}
      >
        <IonIcon icon={addOutline} aria-hidden="true" />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <div className="add-card add-card--open">
      <IonIcon icon={addOutline} className="add-card__icon" aria-hidden="true" />
      <input
        className="add-card__input"
        data-testid="add-card-input"
        placeholder="Name the task"
        value={title}
        autoFocus
        disabled={busy}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => !title.trim() && setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      <button
        type="button"
        className="add-card__add"
        data-testid="add-card-submit"
        disabled={busy || !title.trim()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={submit}
      >
        Add
      </button>
    </div>
  );
}
