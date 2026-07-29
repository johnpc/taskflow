import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { createOutline, trashOutline, checkmarkOutline } from 'ionicons/icons';
import { SectionMoveButtons } from './SectionMoveButtons';

/** Inline rename + delete + move controls for a board section header. Enter or
 * the check commits the rename; the trash deletes; the chevrons move the column.
 * Local edit state only; all mutations delegated. Renders nothing until handlers
 * exist. */
export function SectionActions({
  name,
  onRename,
  onDelete,
  onMove,
}: {
  name: string;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onMove?: (direction: 'left' | 'right') => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  if (!onRename && !onDelete && !onMove) return null;

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) onRename?.(trimmed);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="section-actions">
        <input
          className="section-actions__input"
          data-testid="section-rename-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
        <button
          type="button"
          data-testid="section-rename-save"
          aria-label="Save name"
          onClick={commit}
        >
          <IonIcon icon={checkmarkOutline} />
        </button>
      </span>
    );
  }

  return (
    <span className="section-actions">
      {onMove && <SectionMoveButtons name={name} onMove={onMove} />}
      {onRename && (
        <button
          type="button"
          className="section-actions__btn"
          data-testid="section-rename"
          aria-label={`Rename ${name}`}
          onClick={() => {
            setDraft(name);
            setEditing(true);
          }}
        >
          <IonIcon icon={createOutline} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="section-actions__btn"
          data-testid="section-delete"
          aria-label={`Delete ${name}`}
          onClick={onDelete}
        >
          <IonIcon icon={trashOutline} />
        </button>
      )}
    </span>
  );
}
