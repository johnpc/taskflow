import { IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

/** Left/right move controls for a board section header. Delegates the direction
 * up; rendered only when a column is reorderable. */
export function SectionMoveButtons({
  name,
  onMove,
}: {
  name: string;
  onMove: (direction: 'left' | 'right') => void;
}) {
  return (
    <>
      <button
        type="button"
        className="section-actions__btn"
        data-testid="section-move-left"
        aria-label={`Move ${name} left`}
        onClick={() => onMove('left')}
      >
        <IonIcon icon={chevronBackOutline} />
      </button>
      <button
        type="button"
        className="section-actions__btn"
        data-testid="section-move-right"
        aria-label={`Move ${name} right`}
        onClick={() => onMove('right')}
      >
        <IonIcon icon={chevronForwardOutline} />
      </button>
    </>
  );
}
