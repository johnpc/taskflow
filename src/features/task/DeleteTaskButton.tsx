import { useState } from 'react';
import { IonAlert, IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

/** Delete-task control on task detail: a destructive button that asks for
 * confirmation before deleting. The delete + post-delete navigation are
 * delegated to the parent (which owns the mutation + history). */
export function DeleteTaskButton({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="task-delete"
        data-testid="task-delete"
        onClick={() => setOpen(true)}
      >
        <IonIcon icon={trashOutline} aria-hidden="true" />
        <span>Delete task</span>
      </button>
      <IonAlert
        isOpen={open}
        header="Delete this task?"
        message="This can't be undone."
        data-testid="delete-confirm"
        onDidDismiss={() => setOpen(false)}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Delete',
            role: 'destructive',
            htmlAttributes: { 'data-testid': 'delete-confirm-yes' },
            handler: () => onDelete(),
          },
        ]}
      />
    </>
  );
}
