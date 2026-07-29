import { dueLabel, dueStatus, isDone } from './taskMeta';
import { todayISO } from './today';
import { repeats, type Repeat } from './recurrence';
import { LabelChips } from '../labels/LabelChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The meta row under a card title: a Blocked badge (when the task is blocked),
 * a due chip, a priority flag, and label chips. Extracted from TaskCard to keep
 * that component small. Renders only. */
export function CardMeta({
  task,
  labels,
  blocked,
}: {
  task: TaskRecord;
  labels: LabelRecord[];
  blocked?: boolean;
}) {
  const today = todayISO();
  const due = dueLabel(task.dueDate, today);
  const dueKind = dueStatus(task.dueDate, today, isDone(task));
  return (
    <span className="task-card__meta">
      {blocked && (
        <span className="task-card__blocked" data-testid="task-blocked">
          Blocked
        </span>
      )}
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
      {repeats(task.repeat as Repeat) && (
        <span className="task-card__repeat" data-testid="task-repeat-badge" aria-label="Repeats">
          ↻
        </span>
      )}
      <LabelChips labels={labels} />
    </span>
  );
}
