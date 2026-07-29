import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';

/** A task card's title. Clicking the title opens the task; when renaming is
 * enabled, a small pencil switches to an inline input that commits on Enter/blur
 * via onRename. A pencil (not double-click) keeps open vs. rename unambiguous. */
export function CardTitle({
  title,
  onOpen,
  onRename,
}: {
  title: string;
  onOpen: () => void;
  onRename?: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title) onRename?.(trimmed);
    else setDraft(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        className="task-card__title-input"
        data-testid="card-title-input"
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(title);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span className="task-card__title-row">
      <button type="button" className="task-card__title" data-testid="task-open" onClick={onOpen}>
        {title}
      </button>
      {onRename && (
        <button
          type="button"
          className="task-card__rename"
          data-testid="card-rename"
          aria-label={`Rename ${title}`}
          onClick={() => {
            setDraft(title);
            setEditing(true);
          }}
        >
          <IonIcon icon={pencilOutline} />
        </button>
      )}
    </span>
  );
}
