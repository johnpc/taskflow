import { IonIcon } from '@ionic/react';
import { flagOutline } from 'ionicons/icons';
import { PRIORITY_META, dueLabelWithTime, type Priority } from './taskMeta';
import { todayISO } from './today';
import { cyclePriority } from './cyclePriority';
import type { TaskRecord } from '../../lib/dataClient';

/** The Assignee / Due / Priority column cells of a List-view row. When
 * onQuickEdit is given (board/list), Due + Priority are inline editors;
 * otherwise they render read-only. Split from ListRow to keep it within the
 * line limit. */
export function ListRowCells({
  task,
  onQuickEdit,
}: {
  task: TaskRecord;
  onQuickEdit?: (patch: { dueDate?: string | null; priority?: Priority }) => void;
}) {
  const priority = (task.priority ?? 'NONE') as Priority;
  return (
    <>
      <span className="list-row__assignee" data-testid="row-assignee">
        {task.assigneeEmail ?? '—'}
      </span>
      {onQuickEdit ? (
        <input
          type="date"
          className="list-row__due-input"
          data-testid="row-due-input"
          aria-label={`Due date for ${task.title}`}
          value={task.dueDate ?? ''}
          onChange={(e) => onQuickEdit({ dueDate: e.target.value || null })}
        />
      ) : (
        <span className="list-row__due" data-testid="row-due">
          {dueLabelWithTime(task.dueDate, task.dueTime, todayISO()) ?? '—'}
        </span>
      )}
      <button
        type="button"
        className={`list-row__prio list-row__prio--${priority.toLowerCase()}`}
        data-testid="row-priority"
        aria-label={`Priority ${PRIORITY_META[priority].label} — cycle`}
        disabled={!onQuickEdit}
        onClick={() => onQuickEdit?.({ priority: cyclePriority(priority) })}
      >
        <IonIcon icon={flagOutline} aria-hidden="true" />
        <span>{priority === 'NONE' ? '—' : PRIORITY_META[priority].label}</span>
      </button>
    </>
  );
}
