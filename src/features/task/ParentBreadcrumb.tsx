import { IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useParentTask } from './useParentTask';

/** A "‹ Parent title" breadcrumb shown above a subtask's header, linking back
 * to the parent task. Renders nothing for a top-level task (no parentTaskId).
 * Fetches the parent title itself; navigation is delegated up. */
export function ParentBreadcrumb({
  parentTaskId,
  onOpen,
}: {
  parentTaskId: string | null | undefined;
  onOpen: (id: string) => void;
}) {
  const { data: parent } = useParentTask(parentTaskId);
  if (!parentTaskId) return null;
  return (
    <button
      type="button"
      className="task-breadcrumb"
      data-testid="task-parent-crumb"
      onClick={() => onOpen(parentTaskId)}
    >
      <IonIcon icon={chevronBackOutline} aria-hidden="true" />
      <span>{parent?.title ?? 'Parent task'}</span>
    </button>
  );
}
