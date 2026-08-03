import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone } from './taskMeta';
import { todayISO } from './today';
import { DuePresetButtons } from './DuePresetButtons';

type DuePatch = Partial<Pick<TaskRecord, 'dueDate' | 'dueTime'>>;

/** Due-date row on task detail: the date input, a compact time input beside it
 * (adjunct, not a co-equal full-width field), and the quick presets below. The
 * date reads red/amber when overdue/due-today, matching cards + list + search. */
export function DueDateRow({
  task,
  onPatch,
}: {
  task: TaskRecord;
  onPatch: (patch: DuePatch) => void;
}) {
  const dueKind = dueStatus(task.dueDate, todayISO(), isDone(task));
  const dueClass =
    dueKind === 'overdue' || dueKind === 'today' ? ` task-fields__date--${dueKind}` : '';
  return (
    <div className="task-fields__row">
      <span className="task-fields__label">Due date</span>
      {/* Date + time share one line so the time reads as an adjunct of the date
          (Asana-style), not a mystery full-width field floating below. */}
      <div className="task-fields__due">
        <input
          type="date"
          className={`task-fields__date task-fields__due-date${dueClass}`}
          data-testid="task-due-input"
          value={task.dueDate ?? ''}
          onChange={(e) => onPatch({ dueDate: e.target.value || null, dueTime: null })}
        />
        <input
          type="time"
          className="task-fields__date task-fields__due-time"
          data-testid="task-due-time"
          aria-label="Due time"
          value={task.dueTime ?? ''}
          disabled={!task.dueDate}
          onChange={(e) => onPatch({ dueTime: e.target.value || null })}
        />
      </div>
      <DuePresetButtons onPick={(date) => onPatch({ dueDate: date })} />
    </div>
  );
}
