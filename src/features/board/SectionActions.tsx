import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { createOutline, trashOutline, checkmarkOutline } from 'ionicons/icons';

/** Inline rename + delete controls for a board/list section header. Enter or the
 * check commits the rename; the trash deletes. Local edit state only; both
 * mutations are delegated. Renders nothing interactive until handlers exist. */
export function SectionActions({
  name,
  onRename,
  onDelete,
}: {
  name: string;
  onRename?: (name: string) => void;
  onDelete?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  if (!onRename && !onDelete) return null;

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
