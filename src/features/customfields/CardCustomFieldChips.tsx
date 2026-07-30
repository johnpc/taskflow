import { useCustomFields } from './useCustomFields';
import { customFieldChips } from './customFieldChips';
import type { TaskRecord } from '../../lib/dataClient';

/** The custom-field value chips for a card ("Field: value"). Fetches the
 * project's field definitions itself (react-query dedupes the per-project query
 * across every card), then shows only the fields this task has a value for.
 * Renders nothing when there are none. */
export function CardCustomFieldChips({ task }: { task: TaskRecord }) {
  const { fields } = useCustomFields(task.projectId);
  const chips = customFieldChips(task, fields);
  if (chips.length === 0) return null;
  return (
    <>
      {chips.map((c) => (
        <span key={c.id} className="task-card__cf" data-testid="task-cf-chip">
          {c.name}: {c.value}
        </span>
      ))}
    </>
  );
}
