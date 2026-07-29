import { dueLabelWithTime, dueStatus, isDone, startsInFuture, startLabel } from './taskMeta';
import { todayISO } from './today';
import { repeats, REPEAT_META, type Repeat } from './recurrence';
import { projectColorVar } from '../projects/projectColors';
import { LabelChips } from '../labels/LabelChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The meta row under a card title: an optional project chip (cross-project
 * views only), a Blocked badge, a start-or-due chip (a not-yet-started task
 * shows "Starts Mon D"), a priority flag, subtask-progress + repeat markers,
 * and label chips. Renders. */
export function CardMeta({
  task,
  labels,
  blocked,
  subtasks,
  project,
}: {
  task: TaskRecord;
  labels: LabelRecord[];
  blocked?: boolean;
  subtasks?: { done: number; total: number };
  project?: { name: string; color: string | null };
}) {
  const today = todayISO();
  const done = isDone(task);
  const notStarted = startsInFuture(task.startDate, today, done);
  const due = dueLabelWithTime(task.dueDate, task.dueTime, today);
  const dueKind = dueStatus(task.dueDate, today, done);
  return (
    <span className="task-card__meta">
      {project && (
        <span className="task-card__project" data-testid="task-project">
          <span
            className="task-card__project-dot"
            style={{ background: projectColorVar(project.color) }}
            aria-hidden="true"
          />
          {project.name}
        </span>
      )}
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
      {subtasks && subtasks.total > 0 && (
        <span className="task-card__subs" data-testid="task-subs" aria-label="Subtasks done">
          ◑ {subtasks.done}/{subtasks.total}
        </span>
      )}
      {repeats(task.repeat as Repeat) && (
        <span className="task-card__repeat" data-testid="task-repeat-badge" aria-label="Repeats">
          ↻ {REPEAT_META[task.repeat as Repeat]}
        </span>
      )}
      <LabelChips labels={labels} />
    </span>
  );
}
