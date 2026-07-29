import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useMyTasks } from './useMyTasks';
import { GroupBySegment } from './GroupBySegment';
import { MyTasksBucket } from './MyTasksBucket';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './myTasks.css';

/** My Tasks tab — every open task across projects, grouped by due date,
 * priority, or focus (a persisted switch), with an open-task total. In focus
 * mode each card can be re-filed into Today/Upcoming/Later. Renders only. */
export function MyTasks() {
  useDocumentTitle('My Tasks');
  const { query, buckets, overdue, openTotal, groupMode, setGroupMode, toggleDone, setBucket } =
    useMyTasks();

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
              <MyTasksBucket
                key={bucket.key}
                bucket={bucket}
                showFocusPicker={groupMode === 'focus'}
                onToggleDone={(input) => toggleDone.mutate(input)}
                onSetBucket={(input) => setBucket.mutate(input)}
              />
            ))}
          </div>
        </LoadState>
        <TabBar active="My Tasks" />
      </IonContent>
    </IonPage>
  );
}
