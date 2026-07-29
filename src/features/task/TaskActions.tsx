import { DeleteTaskButton } from './DeleteTaskButton';

/** The task-detail footer actions: duplicate the task, or delete it (with
 * confirm). Both are delegated to the parent, which owns the mutations +
 * navigation. Renders only. */
export function TaskActions({
  duplicating,
  onDuplicate,
  onDelete,
}: {
  duplicating: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="task-detail__actions">
      <button
        type="button"
        className="task-detail__dup"
        data-testid="task-duplicate"
        disabled={duplicating}
        onClick={onDuplicate}
      >
        Duplicate task
      </button>
      <DeleteTaskButton onDelete={onDelete} />
    </div>
  );
}
