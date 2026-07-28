import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useTaskDetail } from './useTaskDetail';
import { TaskDetailBody } from './TaskDetailBody';
import { LoadState } from '../shell/LoadState';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './taskDetail.css';

/** Task detail — a thin load-gate shell around TaskDetailBody. Guests never
 * reach here (RequireAuth). All data + mutations come from useTaskDetail. */
export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const hook = useTaskDetail(id);
  const task = hook.query.data?.task ?? null;
  useDocumentTitle(task?.title ?? 'Task');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/projects" data-testid="task-back" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <LoadState
          isLoading={hook.query.isLoading}
          isError={hook.query.isError}
          isEmpty={!task}
          onRetry={hook.query.refetch}
          emptyTitle="Task not found"
          emptyMessage="This task may have been deleted."
        >
          {task && <TaskDetailBody task={task} hook={hook} />}
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
