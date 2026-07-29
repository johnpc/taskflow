import { DeleteTaskButton } from './DeleteTaskButton';
import { CopyLinkButton } from './CopyLinkButton';

/** The task-detail footer actions: copy the task's link, duplicate the task, or
 * delete it (with confirm). Mutations are delegated to the parent, which owns
 * the navigation. Renders only. */
export function TaskActions({
  taskId,
  duplicating,
  onDuplicate,
  onDelete,
}: {
  taskId: string;
  duplicating: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="task-detail__actions">
      <CopyLinkButton taskId={taskId} />
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
