import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone, dueLabel, dueStatus } from './taskMeta';
import { todayISO } from './today';
import { LabelChips } from '../labels/LabelChips';
import { ReorderControls } from '../board/ReorderControls';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import './task.css';

/** A task card on the board/list. Tapping the circle toggles done; tapping the
 * body opens the task detail. Shows a due-date chip colored by urgency, a
 * priority flag, and any label chips (resolved by the caller). When onReorder is
 * given (board/list only), shows up/down controls. Renders only. */
export function TaskCard({
  task,
  labels = [],
  onToggleDone,
  onReorder,
}: {
  task: TaskRecord;
  labels?: LabelRecord[];
  onToggleDone: (task: TaskRecord) => void;
  onReorder?: (dir: 'up' | 'down') => void;
}) {
  const history = useHistory();
  const done = isDone(task);
  const today = todayISO();
  const due = dueLabel(task.dueDate, today);
  const dueKind = dueStatus(task.dueDate, today, done);

  return (
    <li className={done ? 'task-card task-card--done' : 'task-card'} data-testid="task-card">
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
      <button
        type="button"
        className="task-card__body"
        data-testid="task-open"
        onClick={() => history.push(`/tasks/${task.id}`)}
      >
        <span className="task-card__title">{task.title}</span>
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
      </button>
      {onReorder && <ReorderControls onReorder={onReorder} />}
    </li>
  );
}
