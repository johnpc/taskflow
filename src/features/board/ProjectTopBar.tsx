import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { ProjectMenu } from './ProjectMenu';
import { MemberAvatars } from './MemberAvatars';
import type { ProjectRecord } from '../../lib/dataClient';

/** The project screen's top toolbar: back button, project title, a member
 * presence stack, a favorite star toggle, and the overflow menu (duplicate /
 * archive / delete). Split from ProjectView to keep it a thin composer. */
export function ProjectTopBar({
  project,
  members = [],
  onToggleFavorite,
  onDuplicate,
  onArchive,
  onDelete,
}: {
  project?: ProjectRecord;
  members?: string[];
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const fav = !!project?.favorite;
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/projects" data-testid="board-back" />
        </IonButtons>
        <IonTitle data-testid="project-title">{project?.name ?? 'Project'}</IonTitle>
        <IonButtons slot="end">
          <MemberAvatars members={members} />
          <IonButton
            fill="clear"
            data-testid="project-favorite"
            aria-pressed={fav}
            aria-label={fav ? 'Unfavorite project' : 'Favorite project'}
            onClick={onToggleFavorite}
          >
            <IonIcon slot="icon-only" icon={fav ? star : starOutline} />
          </IonButton>
          <ProjectMenu onDuplicate={onDuplicate} onArchive={onArchive} onDelete={onDelete} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
