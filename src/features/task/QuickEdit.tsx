import { IonIcon } from '@ionic/react';
import { flagOutline } from 'ionicons/icons';
import { cyclePriority } from './cyclePriority';
import type { Priority } from './taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Compact per-card quick-edit: set a due date and cycle priority without opening
 * the task. Both changes are delegated up as a task patch. Presentational. */
export function QuickEdit({
  task,
  onEdit,
}: {
  task: TaskRecord;
  onEdit: (patch: { dueDate?: string | null; priority?: Priority }) => void;
}) {
  return (
    <span className="quick-edit" data-testid="quick-edit">
      <input
        type="date"
        className="quick-edit__date"
        data-testid="quick-edit-date"
        aria-label="Set due date"
        value={task.dueDate ?? ''}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onEdit({ dueDate: e.target.value || null })}
      />
      <button
        type="button"
        className={`quick-edit__prio quick-edit__prio--${(task.priority ?? 'NONE').toLowerCase()}`}
        data-testid="quick-edit-priority"
        aria-label="Cycle priority"
        onClick={() => onEdit({ priority: cyclePriority(task.priority as Priority) })}
      >
        <IonIcon icon={flagOutline} />
      </button>
    </span>
  );
}
