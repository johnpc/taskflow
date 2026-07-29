import { REPEAT_META, type Repeat } from './recurrence';
import type { TaskRecord } from '../../lib/dataClient';

const REPEATS: Repeat[] = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'];

/** Task-detail "Repeat" control: a select that sets how the task recurs. When
 * set (and the task has a due date), completing it spawns the next occurrence.
 * Renders only; the change is delegated up. */
export function RepeatPicker({
  task,
  onChange,
}: {
  task: TaskRecord;
  onChange: (repeat: Repeat) => void;
}) {
  return (
    <div className="task-fields__row" data-testid="task-repeat">
      <span className="task-fields__label">Repeat</span>
      <select
        className="task-fields__select"
        data-testid="task-repeat-select"
        aria-label="Repeat"
        value={(task.repeat as Repeat) ?? 'NONE'}
        onChange={(e) => onChange(e.target.value as Repeat)}
      >
        {REPEATS.map((r) => (
          <option key={r} value={r}>
            {REPEAT_META[r]}
          </option>
        ))}
      </select>
    </div>
  );
}
