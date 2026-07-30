import { IonIcon } from '@ionic/react';
import { listOutline, gridOutline, gitBranchOutline } from 'ionicons/icons';
import type { ViewMode } from './viewMode';

/** Board / List / Timeline segmented toggle for a project. Persisted choice is
 * driven by the parent (useViewMode); this only renders + reports the selection. */
export function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="view-toggle" role="group" aria-label="View">
      <button
        type="button"
        data-testid="view-list"
        className={mode === 'LIST' ? 'view-toggle__seg view-toggle__seg--on' : 'view-toggle__seg'}
        aria-pressed={mode === 'LIST'}
        onClick={() => onChange('LIST')}
      >
        <IonIcon icon={listOutline} aria-hidden="true" />
        <span>List</span>
      </button>
      <button
        type="button"
        data-testid="view-board"
        className={mode === 'BOARD' ? 'view-toggle__seg view-toggle__seg--on' : 'view-toggle__seg'}
        aria-pressed={mode === 'BOARD'}
        onClick={() => onChange('BOARD')}
      >
        <IonIcon icon={gridOutline} aria-hidden="true" />
        <span>Board</span>
      </button>
      <button
        type="button"
        data-testid="view-timeline"
        className={
          mode === 'TIMELINE' ? 'view-toggle__seg view-toggle__seg--on' : 'view-toggle__seg'
        }
        aria-pressed={mode === 'TIMELINE'}
        onClick={() => onChange('TIMELINE')}
      >
        <IonIcon icon={gitBranchOutline} aria-hidden="true" />
        <span>Timeline</span>
      </button>
    </div>
  );
}
