import { IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import type { TaskRecord } from '../../lib/dataClient';

/** The circular complete/uncomplete toggle for a task. Visually distinct from
 * the square multi-select checkbox: it's a ring that, on hover, previews a
 * faded green check so the action feels responsive before you click. Done tasks
 * show a solid green check. Shared by the board card and list row. */
export function CompleteToggle({
  task,
  done,
  onToggle,
}: {
  task: TaskRecord;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="task-card__check"
      data-testid="task-check"
      aria-pressed={done}
      aria-label={done ? `Mark ${task.title} not done` : `Complete ${task.title}`}
      onClick={onToggle}
    >
      {/* The resting glyph: solid check when done, empty ring otherwise. */}
      <IonIcon className="task-card__check-icon" icon={done ? checkmarkCircle : ellipseOutline} />
      {/* Hover preview (only meaningful for not-done): a faded green check that
       * fades in on hover, hinting at what completing will do. */}
      {!done && (
        <IonIcon className="task-card__check-hint" icon={checkmarkCircle} aria-hidden="true" />
      )}
    </button>
  );
}
