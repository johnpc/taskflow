import type { SectionRecord, TaskRecord } from '../../lib/dataClient';
import './taskDetail.css';

/** Task-detail assignment row: move the task to another section, and assign /
 * unassign it (to the signed-in user). Both patch the task; presentational +
 * delegating. */
export function TaskAssignment({
  task,
  sections,
  currentEmail,
  onMove,
  onAssign,
}: {
  task: TaskRecord;
  sections: SectionRecord[];
  currentEmail: string | null;
  onMove: (sectionId: string) => void;
  onAssign: (email: string | null) => void;
}) {
  const assigned = !!task.assigneeEmail;
  return (
    <div className="task-assign">
      <label className="task-fields__row">
        <span className="task-fields__label">Section</span>
        <select
          className="task-assign__select"
          data-testid="task-section-select"
          value={task.sectionId ?? ''}
          onChange={(e) => onMove(e.target.value)}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <div className="task-fields__row">
        <span className="task-fields__label">Assignee</span>
        <button
          type="button"
          className={assigned ? 'task-assign__btn task-assign__btn--on' : 'task-assign__btn'}
          data-testid="task-assign"
          aria-pressed={assigned}
          onClick={() => onAssign(assigned ? null : currentEmail)}
        >
          {assigned ? (task.assigneeEmail ?? 'Assigned') : 'Assign to me'}
        </button>
      </div>
    </div>
  );
}
