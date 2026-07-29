import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone, dueLabel, dueStatus } from './taskMeta';
import { todayISO } from './today';
import { LabelChips } from '../labels/LabelChips';
import { ReorderControls } from '../board/ReorderControls';
import { QuickEdit } from './QuickEdit';
import { CardTitle } from './CardTitle';
import type { Priority } from './taskMeta';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import './task.css';

/** A task card on the board/list. Tapping the circle toggles done; tapping the
 * title opens the task (double-click renames in place when editable). Shows a
 * due chip, priority flag, and labels. When onReorder / onQuickEdit are given
 * (board/list only), shows those controls. Renders only. */
export function TaskCard({
  task,
  labels = [],
  onToggleDone,
  onReorder,
  onQuickEdit,
  selected,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  task: TaskRecord;
  labels?: LabelRecord[];
  onToggleDone: (task: TaskRecord) => void;
  onReorder?: (dir: 'up' | 'down') => void;
  onQuickEdit?: (patch: { dueDate?: string | null; priority?: Priority; title?: string }) => void;
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const history = useHistory();
  const done = isDone(task);
  const today = todayISO();
  const due = dueLabel(task.dueDate, today);
  const dueKind = dueStatus(task.dueDate, today, done);

  return (
    <li
      className={done ? 'task-card task-card--done' : 'task-card'}
      data-testid="task-card"
      data-selected={selected ? 'true' : undefined}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {onSelect && (
        <input
          type="checkbox"
          className="task-card__select"
          data-testid="task-select"
          aria-label={`Select ${task.title}`}
          checked={!!selected}
          onChange={onSelect}
        />
      )}
      <button
        type="button"
        className="task-card__check"
        data-testid="task-check"
        aria-pressed={done}
        aria-label={done ? `Mark ${task.title} not done` : `Complete ${task.title}`}
        onClick={() => onToggleDone(task)}
      >
        <IonIcon icon={done ? checkmarkCircle : ellipseOutline} />
      </button>
      <div className="task-card__body">
        <CardTitle
          title={task.title}
          onOpen={() => history.push(`/tasks/${task.id}`)}
          onRename={onQuickEdit && ((title) => onQuickEdit({ title }))}
        />
        <span className="task-card__meta">
          {due && (
            <span className={`task-card__due task-card__due--${dueKind}`} data-testid="task-due">
              {due}
            </span>
          )}
          {task.priority && task.priority !== 'NONE' && (
            <span className={`task-card__prio task-card__prio--${task.priority.toLowerCase()}`}>
              {task.priority[0] + task.priority.slice(1).toLowerCase()}
            </span>
          )}
          <LabelChips labels={labels} />
        </span>
      </div>
      {onQuickEdit && <QuickEdit task={task} onEdit={onQuickEdit} />}
      {onReorder && <ReorderControls onReorder={onReorder} />}
    </li>
  );
}
