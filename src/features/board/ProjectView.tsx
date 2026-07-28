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
import { BoardColumn } from './BoardColumn';
import { LoadState } from '../shell/LoadState';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './board.css';

/** A project's board — its sections as columns of task cards. Guests never reach
 * here (RequireAuth). Renders only; board data + mutations come from useBoard. */
export function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const project = useProject(id);
  const { query, columns, addTask, toggleDone } = useBoard(id);
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
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={columns.length === 0}
          onRetry={query.refetch}
          emptyTitle="No columns yet"
          emptyMessage="This project has no sections."
        >
          <div className="board" data-testid="board">
            {columns.map((column) => (
              <BoardColumn
                key={column.section.id}
                column={column}
                onAddTask={(input) => addTask.mutate(input)}
                onToggleDone={(input) => toggleDone.mutate(input)}
              />
            ))}
          </div>
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
