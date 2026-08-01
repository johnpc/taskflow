import { IonIcon } from '@ionic/react';
import { checkmarkDoneOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { BulkSelects } from './BulkSelects';
import type { Priority } from '../task/taskMeta';
import type { LabelRecord, SectionRecord } from '../../lib/dataClient';
import './board.css';

/** The bulk-action bar shown when tasks are selected: complete all, move all to
 * a section, assign all to a member, set their priority, delete all, or clear
 * the selection. The dropdowns live in BulkSelects; delegated up. */
export function SelectionBar({
  count,
  sections,
  members = [],
  labels = [],
  onComplete,
  onMove,
  onAssign,
  onPriority,
  onLabel,
  onDelete,
  onClear,
}: {
  count: number;
  sections: SectionRecord[];
  members?: string[];
  labels?: LabelRecord[];
  onComplete: () => void;
  onMove: (sectionId: string) => void;
  onAssign?: (email: string | null) => void;
  onPriority?: (priority: Priority) => void;
  onLabel?: (labelId: string) => void;
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
      <BulkSelects
        sections={sections}
        members={members}
        labels={labels}
        onMove={onMove}
        onAssign={onAssign}
        onPriority={onPriority}
        onLabel={onLabel}
      />
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
