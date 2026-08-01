import { AssigneePicker } from './AssigneePicker';
import { assigneeOptions } from './assigneeOptions';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';
import './taskDetail.css';

/** Task-detail assignment row: move the task to another section, and assign it
 * to any project member (or unassign). Both patch the task; presentational +
 * delegating. Assignee options come from the task's own member list, with the
 * signed-in user ensured present so a solo project can still self-assign. */
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
  const members = assigneeOptions(task.members, currentEmail);
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
      <label className="task-fields__row">
        <span className="task-fields__label">Assignee</span>
        <AssigneePicker assigneeEmail={task.assigneeEmail} members={members} onAssign={onAssign} />
      </label>
    </div>
  );
}
