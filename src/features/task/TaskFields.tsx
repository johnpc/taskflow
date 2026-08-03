import type { TaskRecord } from '../../lib/dataClient';
import { PRIORITY_META, type Priority } from './taskMeta';
import { DueDateRow } from './DueDateRow';
import { NotesPreview } from './NotesPreview';
import { hasRichNotes } from './parseNotes';
import './taskDetail.css';

const PRIORITIES: Priority[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

/** The editable field panel on task detail: due date + priority + notes. Each
 * change is pushed up via onPatch (debounced/immediate is the parent's call).
 * Controlled inputs seeded from the task; presentational + delegating. */
export function TaskFields({
  task,
  onPatch,
}: {
  task: TaskRecord;
  onPatch: (
    patch: Partial<Pick<TaskRecord, 'startDate' | 'dueDate' | 'dueTime' | 'priority' | 'notes'>>,
  ) => void;
}) {
  return (
    <div className="task-fields">
      <div className="task-fields__row">
        <span className="task-fields__label">Start date</span>
        <input
          type="date"
          className="task-fields__date"
          data-testid="task-start-input"
          value={task.startDate ?? ''}
          max={task.dueDate ?? undefined}
          onChange={(e) => onPatch({ startDate: e.target.value || null })}
        />
      </div>

      <DueDateRow task={task} onPatch={onPatch} />

      <div className="task-fields__row">
        <span className="task-fields__label">Priority</span>
        <div className="task-fields__prios" role="group" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              data-testid={`priority-${p.toLowerCase()}`}
              className={
                task.priority === p
                  ? `task-fields__prio task-fields__prio--on task-fields__prio--${p.toLowerCase()}`
                  : 'task-fields__prio'
              }
              aria-pressed={task.priority === p}
              onClick={() => onPatch({ priority: p })}
            >
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>
      </div>

      <label className="task-fields__row task-fields__row--notes">
        <span className="task-fields__label">Notes</span>
        <textarea
          className="task-fields__notes"
          data-testid="task-notes"
          placeholder="Add details… **bold**, [links](https://…), [ ] checklist"
          rows={4}
          defaultValue={task.notes ?? ''}
          onBlur={(e) => onPatch({ notes: e.target.value })}
        />
        {hasRichNotes(task.notes) && <NotesPreview notes={task.notes} />}
      </label>
    </div>
  );
}
