import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail "Milestone" toggle: marks a task as a key checkpoint (◆). A
 * pressed pill toggles the flag; the change is delegated up. Renders only. */
export function MilestoneToggle({
  task,
  onToggle,
}: {
  task: TaskRecord;
  onToggle: (isMilestone: boolean) => void;
}) {
  const on = !!task.isMilestone;
  return (
    <div className="task-fields__row" data-testid="task-milestone-row">
      <span className="task-fields__label">Milestone</span>
      <button
        type="button"
        className={on ? 'task-milestone__btn task-milestone__btn--on' : 'task-milestone__btn'}
        data-testid="task-milestone-toggle"
        aria-pressed={on}
        onClick={() => onToggle(!on)}
      >
        ◆ {on ? 'Milestone' : 'Mark as milestone'}
      </button>
    </div>
  );
}
