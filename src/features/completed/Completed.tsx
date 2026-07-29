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
import { IonIcon } from '@ionic/react';
import { arrowUndoOutline } from 'ionicons/icons';
import { useCompleted } from './useCompleted';
import { LoadState } from '../shell/LoadState';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import { nowISO } from '../task/today';
import { relativeTime } from '../task/relativeTime';
import './completed.css';

/** A project's completed tasks — most-recently done first, each reopenable.
 * Complements the board's hide-completed default. Renders only. */
export function Completed() {
  const { id } = useParams<{ id: string }>();
  const { query, done, reopen } = useCompleted(id);
  useDocumentTitle('Completed');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/projects/${id}`} data-testid="completed-back" />
          </IonButtons>
          <IonTitle>Completed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={done.length === 0}
          onRetry={query.refetch}
          emptyTitle="Nothing completed yet"
          emptyMessage="Tasks you complete in this project show up here."
        >
          <ul className="completed__list" aria-label="Completed tasks">
            {done.map((task) => (
              <li key={task.id} className="completed__row" data-testid="completed-task">
                <span className="completed__title">{task.title}</span>
                {task.completedAt && (
                  <span className="completed__when">
                    {relativeTime(task.completedAt, Date.now())}
                  </span>
                )}
                <button
                  type="button"
                  className="completed__reopen"
                  data-testid="reopen-task"
                  aria-label={`Reopen ${task.title}`}
                  onClick={() => reopen.mutate({ id: task.id, now: nowISO() })}
                >
                  <IonIcon icon={arrowUndoOutline} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
