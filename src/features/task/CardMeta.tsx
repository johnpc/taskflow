import { dueLabelWithTime, dueStatus, isDone, startsInFuture, startLabel } from './taskMeta';
import { todayISO } from './today';
import { approvalMeta, type Approval } from './approval';
import { CardMarkers } from './CardMarkers';
import { projectColorVar } from '../projects/projectColors';
import { LabelChips } from '../labels/LabelChips';
import { CardCustomFieldChips } from '../customfields/CardCustomFieldChips';
import { AssigneeAvatar } from './AssigneeAvatar';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The meta row under a card title: an optional project chip (cross-project
 * views only), a Blocked badge, a start-or-due chip (a not-yet-started task
 * shows "Starts Mon D"), a priority flag, subtask-progress + repeat markers,
 * label chips, and any set custom-field value chips. Renders. */
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
  const approval = approvalMeta(task.approval as Approval);
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
      {approval && (
        <span
          className="task-card__approval"
          data-testid="task-approval-badge"
          style={{ color: `var(${approval.colorVar})` }}
        >
          {approval.label}
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
      <CardMarkers task={task} subtasks={subtasks} />
      <LabelChips labels={labels} />
      <CardCustomFieldChips task={task} />
      <AssigneeAvatar email={task.assigneeEmail} />
    </span>
  );
}
