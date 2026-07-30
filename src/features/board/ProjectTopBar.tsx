import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { ProjectMenu } from './ProjectMenu';
import type { ProjectRecord } from '../../lib/dataClient';

/** The project screen's top toolbar: back button, project title, and the
 * overflow menu (duplicate / archive / delete). Split from ProjectView to keep
 * that screen a thin composer under the line limit. */
export function ProjectTopBar({
  project,
  onDuplicate,
  onArchive,
  onDelete,
}: {
  project?: ProjectRecord;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/projects" data-testid="board-back" />
        </IonButtons>
        <IonTitle data-testid="project-title">{project?.name ?? 'Project'}</IonTitle>
        <IonButtons slot="end">
          <ProjectMenu onDuplicate={onDuplicate} onArchive={onArchive} onDelete={onDelete} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
