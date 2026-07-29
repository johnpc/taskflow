import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone } from './taskMeta';
import { ReorderControls } from '../board/ReorderControls';
import { QuickEdit } from './QuickEdit';
import { CardTitle } from './CardTitle';
import { CardMeta } from './CardMeta';
import { taskCardShell } from './taskCardShell';
import type { Priority } from './taskMeta';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';
import './task.css';

/** A task card on the board/list. Tapping the circle toggles done; tapping the
 * title opens the task (double-click renames in place when editable). Shows a
 * Blocked badge, due chip, priority flag, and labels via CardMeta. When
 * onReorder / onQuickEdit are given (board/list only), shows those controls. */
export function TaskCard({
  task,
  labels = [],
  blocked,
  subtasks,
  onToggleDone,
  onReorder,
  onQuickEdit,
  selected,
  onSelect,
  onDragStart,
  onDragEnd,
  onDropTask,
}: {
  task: TaskRecord;
  labels?: LabelRecord[];
  blocked?: boolean;
  subtasks?: { done: number; total: number };
  onToggleDone: (task: TaskRecord) => void;
  onReorder?: (dir: 'up' | 'down') => void;
  onQuickEdit?: (patch: { dueDate?: string | null; priority?: Priority; title?: string }) => void;
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDropTask?: () => void;
}) {
  const history = useHistory();
  const done = isDone(task);
  const shell = taskCardShell(task.color, onDropTask);

  return (
    <li
      className={done ? 'task-card task-card--done' : 'task-card'}
      data-testid="task-card"
      data-colored={shell.colored}
      style={shell.style}
      data-selected={selected ? 'true' : undefined}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...shell.drop}
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
        <CardMeta task={task} labels={labels} blocked={blocked} subtasks={subtasks} />
      </div>
      {onQuickEdit && <QuickEdit task={task} onEdit={onQuickEdit} />}
      {onReorder && <ReorderControls onReorder={onReorder} />}
    </li>
  );
}
