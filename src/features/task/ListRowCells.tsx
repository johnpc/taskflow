import { PRIORITY_META, dueLabelWithTime, dueStatus, isDone, type Priority } from './taskMeta';
import { todayISO } from './today';
import { AssigneePicker } from './AssigneePicker';
import { AssigneeName } from './AssigneeName';
import type { TaskRecord } from '../../lib/dataClient';

const PRIORITIES: Priority[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

type CellPatch = { dueDate?: string | null; priority?: Priority; assigneeEmail?: string | null };

/** Extra class on the Due cell so an overdue (or due-today) date reads red/amber
 * like Asana — mirrors the card's due coloring via dueStatus. */
function dueClass(task: TaskRecord, today: string): string {
  const kind = dueStatus(task.dueDate, today, isDone(task));
  return kind === 'overdue' || kind === 'today' ? ` list-row__due--${kind}` : '';
}

/** The Assignee / Due / Priority column cells of a List-view row. When
 * onQuickEdit is given (board/list) all three are inline editors — Assignee and
 * Priority are dropdowns, Due is a date input; otherwise they render read-only.
 * Split from ListRow to keep it within the line limit. */
export function ListRowCells({
  task,
  members = [],
  onQuickEdit,
}: {
  task: TaskRecord;
  members?: string[];
  onQuickEdit?: (patch: CellPatch) => void;
}) {
  const priority = (task.priority ?? 'NONE') as Priority;
  const today = todayISO();
  if (!onQuickEdit) {
    return (
      <>
        <AssigneeName email={task.assigneeEmail} />
        <span className={`list-row__due${dueClass(task, today)}`} data-testid="row-due">
          {dueLabelWithTime(task.dueDate, task.dueTime, today) ?? '—'}
        </span>
        <span
          className={`list-row__prio list-row__prio--${priority.toLowerCase()}`}
          data-testid="row-priority"
        >
          {priority === 'NONE' ? '—' : PRIORITY_META[priority].label}
        </span>
      </>
    );
  }
  return (
    <>
      <span className="list-row__assignee" data-testid="row-assignee">
        <AssigneePicker
          assigneeEmail={task.assigneeEmail}
          members={members}
          onAssign={(assigneeEmail) => onQuickEdit({ assigneeEmail })}
        />
      </span>
      <input
        type="date"
        className={`list-row__due-input${dueClass(task, today)}`}
        data-testid="row-due-input"
        aria-label={`Due date for ${task.title}`}
        value={task.dueDate ?? ''}
        onChange={(e) => onQuickEdit({ dueDate: e.target.value || null })}
      />
      <select
        className={`list-row__prio-select list-row__prio--${priority.toLowerCase()}`}
        data-testid="row-priority"
        aria-label={`Priority for ${task.title}`}
        value={priority}
        onChange={(e) => onQuickEdit({ priority: e.target.value as Priority })}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p === 'NONE' ? 'No priority' : PRIORITY_META[p].label}
          </option>
        ))}
      </select>
    </>
  );
}
