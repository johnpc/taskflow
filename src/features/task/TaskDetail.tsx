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
import { TaskHeader } from './TaskHeader';
import { TaskFields } from './TaskFields';
import { TaskLabels } from './TaskLabels';
import { Subtasks } from './Subtasks';
import { Comments } from './Comments';
import { LoadState } from '../shell/LoadState';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import { nextSubtaskOrder } from './nextSubtaskOrder';
import { nowISO } from './today';
import './taskDetail.css';

/** Task detail — the full editable task: title + done, fields, subtasks, and
 * comments. Renders only; all data + mutations come from useTaskDetail. */
export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { query, patch, toggleDone, addSubtask, comment, labels } = useTaskDetail(id);
  const task = query.data?.task ?? null;
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
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={!task}
          onRetry={query.refetch}
          emptyTitle="Task not found"
          emptyMessage="This task may have been deleted."
        >
          {task && (
            <div className="task-detail" data-testid="task-detail">
              <TaskHeader
                task={task}
                onToggleDone={(done) => toggleDone.mutate({ taskId: task.id, done, now: nowISO() })}
                onRename={(title) => patch.mutate({ id: task.id, title })}
              />
              <TaskFields task={task} onPatch={(p) => patch.mutate({ id: task.id, ...p })} />
              <TaskLabels
                task={task}
                registry={labels.query.data ?? []}
                onPatchLabels={(labelIds) => patch.mutate({ id: task.id, labelIds })}
                onCreateLabel={(input) => labels.create.mutate(input)}
              />
              <Subtasks
                subtasks={query.data?.subtasks ?? []}
                onAdd={(title) =>
                  addSubtask.mutate({
                    projectId: task.projectId,
                    title,
                    order: nextSubtaskOrder(query.data?.subtasks ?? []),
                  })
                }
                onToggle={(input) => toggleDone.mutate(input)}
              />
              <Comments
                comments={query.data?.comments ?? []}
                busy={comment.isPending}
                onPost={(body) => comment.mutate(body)}
              />
            </div>
          )}
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
