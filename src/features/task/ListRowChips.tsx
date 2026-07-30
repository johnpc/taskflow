import { LabelChips } from '../labels/LabelChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The secondary chips shown under a List-view row title: milestone marker,
 * Blocked badge, subtask progress, and label chips. Due + priority are their
 * own aligned columns in the list, so they're intentionally omitted here. */
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
  if (!task.isMilestone && !blocked && !hasSubs && labels.length === 0) return null;
  return (
    <span className="list-row__chips">
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
    </span>
  );
}
