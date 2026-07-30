import { LabelChips } from '../labels/LabelChips';
import { CardCustomFieldChips } from '../customfields/CardCustomFieldChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The secondary chips shown under a List-view row title: milestone marker,
 * Blocked badge, subtask progress, label chips, and custom-field values (so the
 * list surfaces the same custom data as the board card). Due + priority are
 * their own aligned columns in the list, so they're intentionally omitted here. */
export function ListRowChips({
  task,
  labels,
  blocked,
  subtasks,
}: {
  task: TaskRecord;
  labels: LabelRecord[];
  blocked?: boolean;
  subtasks?: { done: number; total: number };
}) {
  const hasSubs = subtasks && subtasks.total > 0;
  return (
    <span className="list-row__chips" data-testid="list-row-chips">
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
      {hasSubs && (
        <span className="task-card__subs" data-testid="task-subs" aria-label="Subtasks done">
          ◑ {subtasks.done}/{subtasks.total}
        </span>
      )}
      <LabelChips labels={labels} />
      <CardCustomFieldChips task={task} />
    </span>
  );
}
