import { dueLabelWithTime, dueStatus, isDone, startsInFuture, startLabel } from './taskMeta';
import { todayISO } from './today';
import { repeats, type Repeat } from './recurrence';
import { LabelChips } from '../labels/LabelChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The meta row under a card title: a Blocked badge, a start-or-due chip (a
 * not-yet-started task shows "Starts Mon D" instead of its due date), a
 * priority flag, repeat marker, and label chips. Renders only. */
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
  const done = isDone(task);
  const notStarted = startsInFuture(task.startDate, today, done);
  const due = dueLabelWithTime(task.dueDate, task.dueTime, today);
  const dueKind = dueStatus(task.dueDate, today, done);
  return (
    <span className="task-card__meta">
      {task.isMilestone && (
        <span className="task-card__milestone" data-testid="task-milestone" aria-label="Milestone">
          ◆ Milestone
        </span>
      )}
      {blocked && (
        <span className="task-card__blocked" data-testid="task-blocked">
          Blocked
        </span>
      )}
      {notStarted ? (
        <span className="task-card__start" data-testid="task-start">
          {startLabel(task.startDate, today)}
        </span>
      ) : (
        due && (
          <span className={`task-card__due task-card__due--${dueKind}`} data-testid="task-due">
            {due}
          </span>
        )
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
