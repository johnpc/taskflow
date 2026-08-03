import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useMyTasks } from './useMyTasks';
import { GroupBySegment } from './GroupBySegment';
import { MyTasksBucket } from './MyTasksBucket';
import { MyTasksQuickAdd } from './MyTasksQuickAdd';
import { MyTasksFilters } from './MyTasksFilters';
import { MyTasksSort } from './MyTasksSort';
import { useQuickAdd } from './useQuickAdd';
import { useProjects } from '../projects/useProjects';
import { useProjectsById } from '../projects/useProjectsById';
import { LoadState } from '../shell/LoadState';
import { SkeletonRows } from '../shell/SkeletonRows';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './myTasks.css';

/** My Tasks tab — every open task across projects, grouped by due date,
 * priority, or focus (a persisted switch), with an open-task total. In focus
 * mode each card can be re-filed into Today/Upcoming/Later. Renders only. */
export function MyTasks() {
  useDocumentTitle('My Tasks');
  const {
    query,
    buckets,
    overdue,
    openTotal,
    groupMode,
    setGroupMode,
    showCompleted,
    setShowCompleted,
    assignedOnly,
    setAssignedOnly,
    followingOnly,
    setFollowingOnly,
    sort,
    setSort,
    toggleDone,
    setBucket,
  } = useMyTasks();
  const projectsById = useProjectsById();
  const projects = useProjects().data ?? [];
  const quickAdd = useQuickAdd();

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
        <MyTasksQuickAdd projects={projects} onAdd={(input) => quickAdd.mutate(input)} />
        <GroupBySegment mode={groupMode} onChange={setGroupMode} />
        <MyTasksFilters
          showCompleted={showCompleted}
          onShowCompleted={setShowCompleted}
          assignedOnly={assignedOnly}
          onAssignedOnly={setAssignedOnly}
          followingOnly={followingOnly}
          onFollowingOnly={setFollowingOnly}
        />
        <MyTasksSort sort={sort} onChange={setSort} />
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={buckets.length === 0}
          onRetry={query.refetch}
          skeleton={<SkeletonRows variant="row" />}
          emptyTitle="You’re all caught up"
          emptyMessage="No open tasks. Add tasks in a project and they’ll show up here."
        >
          <div className="mytasks__buckets">
            {buckets.map((bucket) => (
              <MyTasksBucket
                key={bucket.key}
                bucket={bucket}
                showFocusPicker={groupMode === 'focus'}
                projectsById={projectsById}
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
