import { IonIcon } from '@ionic/react';
import { chevronUp, chevronDown } from 'ionicons/icons';

/** Up/down reorder affordances for a task card within its column. Rendered only
 * when a board provides an onReorder handler (not in My Tasks / Search). */
export function ReorderControls({ onReorder }: { onReorder: (dir: 'up' | 'down') => void }) {
  return (
    <span className="reorder" data-testid="reorder">
      <button
        type="button"
        className="reorder__btn"
        data-testid="reorder-up"
        aria-label="Move up"
        onClick={() => onReorder('up')}
      >
        <IonIcon icon={chevronUp} />
      </button>
      <button
        type="button"
        className="reorder__btn"
        data-testid="reorder-down"
        aria-label="Move down"
        onClick={() => onReorder('down')}
      >
        <IonIcon icon={chevronDown} />
      </button>
    </span>
  );
}
