import { IonIcon } from '@ionic/react';
import { checkmarkDoneOutline, trashOutline, closeOutline } from 'ionicons/icons';
import type { SectionRecord } from '../../lib/dataClient';
import './board.css';

/** The bulk-action bar shown when tasks are selected (list view): complete all,
 * move all to a section, delete all, or clear the selection. Delegated up. */
export function SelectionBar({
  count,
  sections,
  onComplete,
  onMove,
  onDelete,
  onClear,
}: {
  count: number;
  sections: SectionRecord[];
  onComplete: () => void;
  onMove: (sectionId: string) => void;
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
      <select
        className="selection-bar__move"
        data-testid="bulk-move"
        aria-label="Move selected to section"
        value=""
        onChange={(e) => e.target.value && onMove(e.target.value)}
      >
        <option value="">Move to…</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
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
