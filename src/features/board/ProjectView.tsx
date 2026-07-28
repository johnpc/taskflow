import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useBoard } from './useBoard';
import { useProject } from './useProject';
import { useViewMode } from './useViewMode';
import { ViewToggle } from './ViewToggle';
import { BoardContent } from './BoardContent';
import { LoadState } from '../shell/LoadState';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import type { ViewMode } from './viewMode';
import './board.css';

/** A project's board/list — its sections rendered per the chosen view. Guests
 * never reach here (RequireAuth). Renders only; data + mutations from useBoard. */
export function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const project = useProject(id);
  const { query, columns, addTask, toggleDone, labels } = useBoard(id);
  const { mode, choose } = useViewMode(id, project.data?.view as ViewMode | undefined);
  useDocumentTitle(project.data?.name ?? 'Project');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/projects" data-testid="board-back" />
          </IonButtons>
          <IonTitle>{project.data?.name ?? 'Project'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <ViewToggle mode={mode} onChange={choose} />
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={columns.length === 0}
          onRetry={query.refetch}
          emptyTitle="No columns yet"
          emptyMessage="This project has no sections."
        >
          <BoardContent
            mode={mode}
            columns={columns}
            labels={labels}
            onAddTask={(input) => addTask.mutate(input)}
            onToggleDone={(input) => toggleDone.mutate(input)}
          />
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
