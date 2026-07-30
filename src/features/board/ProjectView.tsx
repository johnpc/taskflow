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
import { useGroupBy } from './useGroupBy';
import { useListSort } from './useListSort';
import { useBoardFilter } from './useBoardFilter';
import { useProjectEdit } from './useProjectEdit';
import { useProjectActions } from './useProjectActions';
import { ViewToggle } from './ViewToggle';
import { FilterBar } from './FilterBar';
import { SavedViewsRegion } from './SavedViewsRegion';
import { ProjectHeader } from './ProjectHeader';
import { ProjectShareRegion } from './ProjectShareRegion';
import { ProjectFieldsRegion } from '../customfields/ProjectFieldsRegion';
import { ProjectMenu } from './ProjectMenu';
import { SelectionBar } from './SelectionBar';
import { useBulkSelection } from './useBulkSelection';
import { BoardRegion } from './BoardRegion';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import type { ViewMode } from './viewMode';
import './board.css';

/** A project's board/list — its sections rendered per the chosen view. Guests
 * never reach here (RequireAuth). Renders only; data + mutations from useBoard. */
export function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const project = useProject(id);
  const { filter, update, replace } = useBoardFilter();
  const board = useBoard(id, filter);
  const { mode, choose } = useViewMode(id, project.data?.view as ViewMode | undefined);
  const { groupBy, choose: chooseGroup } = useGroupBy(id);
  const { sort, toggle: toggleSort } = useListSort(id);
  const edit = useProjectEdit(id);
  const actions = useProjectActions(id);
  const bulk = useBulkSelection(board);
  const memberList = (project.data?.members ?? []).filter((m): m is string => !!m);
  useDocumentTitle(project.data?.name ?? 'Project');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/projects" data-testid="board-back" />
          </IonButtons>
          <IonTitle>{project.data?.name ?? 'Project'}</IonTitle>
          <IonButtons slot="end">
            <ProjectMenu onArchive={actions.archiveAndLeave} onDelete={actions.deleteAndLeave} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {project.data && (
          <ProjectHeader
            project={project.data}
            onDescribe={(description) => edit.mutate({ id, description })}
            onSetStatus={(next) => edit.mutate({ id, ...next })}
            onAddSection={(name) => board.addSection.mutate(name)}
          />
        )}
        <ProjectShareRegion projectId={id} members={memberList} />
        <ProjectFieldsRegion projectId={id} />
        <ViewToggle mode={mode} onChange={choose} />
        <FilterBar filter={filter} labels={board.labels} members={memberList} onChange={update} />
        <SavedViewsRegion projectId={id} filter={filter} onApply={replace} />
        {mode === 'LIST' && bulk.selection.active && (
          <SelectionBar
            count={bulk.selection.count}
            sections={board.columns.map((c) => c.section)}
            onComplete={bulk.completeSelected}
            onMove={bulk.moveSelected}
            onDelete={bulk.deleteSelected}
            onClear={bulk.selection.clear}
          />
        )}
        <BoardRegion
          board={board}
          mode={mode}
          bulk={bulk}
          members={memberList}
          groupBy={groupBy}
          onGroupBy={chooseGroup}
          sort={sort}
          onSort={toggleSort}
        />
      </IonContent>
    </IonPage>
  );
}
