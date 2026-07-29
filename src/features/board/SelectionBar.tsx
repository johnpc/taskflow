import { IonIcon } from '@ionic/react';
import { checkmarkDoneOutline, trashOutline, closeOutline } from 'ionicons/icons';
import './board.css';

/** The bulk-action bar shown when tasks are selected (list view): complete all,
 * delete all, or clear the selection. Actions are delegated up. */
export function SelectionBar({
  count,
  onComplete,
  onDelete,
  onClear,
}: {
  count: number;
  onComplete: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div className="selection-bar" data-testid="selection-bar">
      <span className="selection-bar__count">{count} selected</span>
      <button
        type="button"
        className="selection-bar__btn"
        data-testid="bulk-complete"
        onClick={onComplete}
      >
        <IonIcon icon={checkmarkDoneOutline} aria-hidden="true" />
        <span>Complete</span>
      </button>
      <button
        type="button"
        className="selection-bar__btn selection-bar__btn--danger"
        data-testid="bulk-delete"
        onClick={onDelete}
      >
        <IonIcon icon={trashOutline} aria-hidden="true" />
        <span>Delete</span>
      </button>
      <button
        type="button"
        className="selection-bar__btn"
        data-testid="bulk-clear"
        aria-label="Clear selection"
        onClick={onClear}
      >
        <IonIcon icon={closeOutline} aria-hidden="true" />
      </button>
    </div>
  );
}
