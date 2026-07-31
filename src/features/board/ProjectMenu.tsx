import { useState } from 'react';
import { IonActionSheet, IonAlert, IonButton, IonIcon } from '@ionic/react';
import { ellipsisHorizontal } from 'ionicons/icons';

/** Board-header overflow menu: copy link, duplicate, archive, or delete the
 * project. Copy/duplicate/archive are immediate; delete asks for confirmation.
 * All actions are delegated up. */
export function ProjectMenu({
  onCopyLink,
  onDuplicate,
  onArchive,
  onDelete,
}: {
  onCopyLink: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <IonButton
        fill="clear"
        data-testid="project-menu"
        aria-label="Project actions"
        onClick={() => setSheet(true)}
      >
        <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
      </IonButton>
      <IonActionSheet
        isOpen={sheet}
        onDidDismiss={() => setSheet(false)}
        header="Project"
        buttons={[
          {
            text: 'Copy link',
            htmlAttributes: { 'data-testid': 'project-copy-link' },
            handler: onCopyLink,
          },
          {
            text: 'Duplicate project',
            htmlAttributes: { 'data-testid': 'project-duplicate' },
            handler: onDuplicate,
          },
          {
            text: 'Archive project',
            htmlAttributes: { 'data-testid': 'project-archive' },
            handler: onArchive,
          },
          {
            text: 'Delete project',
            role: 'destructive',
            htmlAttributes: { 'data-testid': 'project-delete' },
            handler: () => setConfirm(true),
          },
          { text: 'Cancel', role: 'cancel' },
        ]}
      />
      <IonAlert
        isOpen={confirm}
        header="Delete this project?"
        message="This permanently deletes the project and all its tasks."
        onDidDismiss={() => setConfirm(false)}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Delete',
            role: 'destructive',
            htmlAttributes: { 'data-testid': 'project-delete-confirm' },
            handler: onDelete,
          },
        ]}
      />
    </>
  );
}
