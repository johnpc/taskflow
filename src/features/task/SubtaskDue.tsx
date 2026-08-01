import { dueLabel, dueStatus } from './taskMeta';

/** A subtask's due date on the checklist: a colored chip ("Overdue"/"Tomorrow"/
 * "Aug 3") whose color reflects overdue/today. When `onSetDue` is given it's
 * editable — a transparent native date input overlays the chip so clicking it
 * opens the picker while the friendly label + color stay visible. Undated +
 * editable shows a subtle "Due date" affordance. */
export function SubtaskDue({
  dueDate,
  done,
  today,
  onSetDue,
}: {
  dueDate: string | null | undefined;
  done: boolean;
  today: string;
  onSetDue?: (dueDate: string | null) => void;
}) {
  if (!dueDate && !onSetDue) return null;
  const kind = dueDate ? dueStatus(dueDate, today, done) : 'none';
  const label = dueDate ? dueLabel(dueDate, today) : 'Due date';
  const chip = (
    <span className={`subtask__due subtask__due--${kind}`} data-testid="subtask-due">
      {label}
    </span>
  );
  if (!onSetDue) return chip;
  return (
    <label className="subtask__due-edit" data-testid="subtask-due-edit">
      {chip}
      <input
        type="date"
        className="subtask__due-input"
        aria-label="Set subtask due date"
        value={dueDate ?? ''}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onSetDue(e.target.value || null)}
      />
    </label>
  );
}
