import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useMyTasks } from './useMyTasks';
import { GroupBySegment } from './GroupBySegment';
import { TaskCard } from '../task/TaskCard';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import { nowISO } from '../task/today';
import './myTasks.css';

/** My Tasks tab — every open task across projects, grouped by due date or
 * priority (a persisted switch), with an open-task total. Renders only. */
export function MyTasks() {
  useDocumentTitle('My Tasks');
  const { query, buckets, overdue, openTotal, groupMode, setGroupMode, toggleDone } = useMyTasks();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 className="tf-heading mytasks__title">What’s on your plate</h1>
        <p className="mytasks__summary" data-testid="mytasks-summary">
          <span data-testid="mytasks-open">{openTotal} open</span>
          {overdue > 0 && (
            <span className="mytasks__overdue" data-testid="mytasks-overdue">
              {overdue} overdue
            </span>
          )}
        </p>
        <GroupBySegment mode={groupMode} onChange={setGroupMode} />
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={buckets.length === 0}
          onRetry={query.refetch}
          emptyTitle="You’re all caught up"
          emptyMessage="No open tasks. Add tasks in a project and they’ll show up here."
        >
          <div className="mytasks__buckets">
            {buckets.map((bucket) => (
              <section
                key={bucket.key}
                className="mytasks__bucket"
                data-testid={`bucket-${bucket.key}`}
              >
                <h2 className="mytasks__bucket-head">
                  {bucket.label}
                  <span className="mytasks__bucket-count">{bucket.tasks.length}</span>
                </h2>
                <ul className="mytasks__list">
                  {bucket.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleDone={(t) =>
                        toggleDone.mutate({ id: t.id, done: t.status !== 'DONE', now: nowISO() })
                      }
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </LoadState>
        <TabBar active="My Tasks" />
      </IonContent>
    </IonPage>
  );
}
