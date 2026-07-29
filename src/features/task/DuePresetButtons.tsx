import { duePresets } from './duePresets';
import { todayISO } from './today';

/** Quick "Today / Tomorrow / Next week" buttons that set a task's due date.
 * Delegates the chosen date up. `todayISO` is the one impure clock read. */
export function DuePresetButtons({ onPick }: { onPick: (date: string) => void }) {
  const presets = duePresets(todayISO());
  return (
    <span className="due-presets" role="group" aria-label="Due date presets">
      {presets.map((p) => (
        <button
          key={p.key}
          type="button"
          className="due-presets__btn"
          data-testid={`due-preset-${p.key}`}
          onClick={() => onPick(p.date)}
        >
          {p.label}
        </button>
      ))}
    </span>
  );
}
