import { IonIcon } from '@ionic/react';
import { chevronBackOutline, arrowUpOutline } from 'ionicons/icons';
import { useParentTask } from './useParentTask';

/** A "‹ Parent title" breadcrumb shown above a subtask's header, linking back to
 * the parent task, plus a "Promote to task" action that lifts the subtask out to
 * a standalone task. Renders nothing for a top-level task (no parentTaskId).
 * Fetches the parent title itself; navigation + promotion are delegated up. */
export function ParentBreadcrumb({
  parentTaskId,
  onOpen,
  onPromote,
}: {
  parentTaskId: string | null | undefined;
  onOpen: (id: string) => void;
  onPromote?: () => void;
}) {
  const { data: parent } = useParentTask(parentTaskId);
  if (!parentTaskId) return null;
  return (
    <div className="task-breadcrumb-row">
      <button
        type="button"
        className="task-breadcrumb"
        data-testid="task-parent-crumb"
        onClick={() => onOpen(parentTaskId)}
      >
        <IonIcon icon={chevronBackOutline} aria-hidden="true" />
        <span>{parent?.title ?? 'Parent task'}</span>
      </button>
      {onPromote && (
        <button
          type="button"
          className="task-breadcrumb__promote"
          data-testid="task-promote"
          onClick={onPromote}
        >
          <IonIcon icon={arrowUpOutline} aria-hidden="true" />
          <span>Promote to task</span>
        </button>
      )}
    </div>
  );
}
