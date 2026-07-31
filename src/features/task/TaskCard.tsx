import { isDone } from './taskMeta';
import { ReorderControls } from '../board/ReorderControls';
import { QuickEdit } from './QuickEdit';
import { CardBody } from './CardBody';
import { CompleteToggle } from './CompleteToggle';
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
  project,
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
  project?: { name: string; color: string | null };
  onToggleDone: (task: TaskRecord) => void;
  onReorder?: (dir: 'up' | 'down') => void;
  onQuickEdit?: (patch: { dueDate?: string | null; priority?: Priority; title?: string }) => void;
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDropTask?: () => void;
}) {
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
          draggable={false}
          // The card is draggable; stop a pointer-down on the checkbox from
          // starting a card drag so ticking it stays reliable (esp. on the board).
          onPointerDown={(e) => e.stopPropagation()}
          onChange={onSelect}
        />
      )}
      <CompleteToggle task={task} done={done} onToggle={() => onToggleDone(task)} />
      <CardBody
        task={task}
        labels={labels}
        blocked={blocked}
        subtasks={subtasks}
        project={project}
        onRename={onQuickEdit && ((title) => onQuickEdit({ title }))}
      />
      {onQuickEdit && <QuickEdit task={task} onEdit={onQuickEdit} />}
      {onReorder && <ReorderControls onReorder={onReorder} />}
    </li>
  );
}
