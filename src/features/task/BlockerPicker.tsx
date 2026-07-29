import { isDone } from './taskMeta';
import { cleanIds, blockerCandidates } from './dependencies';
import type { TaskRecord } from '../../lib/dataClient';

/** Toggle list of same-project tasks that block this one. Each candidate is a
 * chip (on = a blocker); done blockers read struck-through so it's clear they
 * no longer hold. Toggle is delegated up. Renders only. */
export function BlockerPicker({
  task,
  candidates,
  onToggle,
}: {
  task: TaskRecord;
  candidates: TaskRecord[];
  onToggle: (id: string) => void;
}) {
  const selected = new Set(cleanIds(task.blockedByIds));
  const options = blockerCandidates(task, candidates);
  if (options.length === 0) {
    return <p className="tf-muted deps__empty">No other tasks in this project yet.</p>;
  }
  return (
    <div className="deps__options" data-testid="blocker-picker">
      {options.map((t) => {
        const on = selected.has(t.id);
        return (
          <button
            key={t.id}
            type="button"
            data-testid="blocker-option"
            className={`deps-opt${on ? ' deps-opt--on' : ''}${isDone(t) ? ' deps-opt--done' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(t.id)}
          >
            {t.title}
          </button>
        );
      })}
    </div>
  );
}
