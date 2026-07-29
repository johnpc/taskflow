import { PROJECT_COLORS, projectColorVar } from '../projects/projectColors';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail highlight-color picker: a None option plus a swatch per palette
 * color. The chosen key is stored on Task.color and drives the card accent
 * stripe. Renders only; the change is delegated up. */
export function TaskColorPicker({
  task,
  onChange,
}: {
  task: TaskRecord;
  onChange: (color: string | null) => void;
}) {
  return (
    <div className="task-fields__row" data-testid="task-color-row">
      <span className="task-fields__label">Highlight</span>
      <div className="task-color__swatches" role="group" aria-label="Highlight color">
        <button
          type="button"
          data-testid="task-color-none"
          className={task.color ? 'task-color__none' : 'task-color__none task-color__none--on'}
          aria-pressed={!task.color}
          aria-label="No highlight"
          onClick={() => onChange(null)}
        >
          None
        </button>
        {PROJECT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            data-testid={`task-color-${c}`}
            className={
              task.color === c ? 'task-color__swatch task-color__swatch--on' : 'task-color__swatch'
            }
            style={{ background: projectColorVar(c) }}
            aria-pressed={task.color === c}
            aria-label={c}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
}
