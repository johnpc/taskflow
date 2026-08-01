import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useBoard } from './useBoard';
import { useProject } from './useProject';
import { useViewMode } from './useViewMode';
import { useGroupBy } from './useGroupBy';
import { useListSort } from './useListSort';
import { useBoardFilter } from './useBoardFilter';
import { useProjectEdit } from './useProjectEdit';
import { useProjectActions } from './useProjectActions';
import { projectLink } from './projectLink';
import { useToggleFavorite } from '../projects/useProjects';
import { ViewToggle } from './ViewToggle';
import { CollapseAllButton } from './CollapseAllButton';
import { FilterBar } from './FilterBar';
import { SavedViewsRegion } from './SavedViewsRegion';
import { ProjectHeaderRegion } from './ProjectHeaderRegion';
import { useCustomFields } from '../customfields/useCustomFields';
import { ProjectTopBar } from './ProjectTopBar';
import { ProjectSelectionBar } from './ProjectSelectionBar';
import { useBulkSelection } from './useBulkSelection';
import { BoardRegion } from './BoardRegion';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import type { ViewMode } from './viewMode';
import './board.css';

/** A project's board/list, board-first: view toggle + filters + board are the
 * hero, project overview/settings below. Guests can't reach here. Renders only. */
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
  const favorite = useToggleFavorite();
  const bulk = useBulkSelection(board);
  const { fields: customFields } = useCustomFields(id);
  const memberList = (project.data?.members ?? []).filter((m): m is string => !!m);
  useDocumentTitle(project.data?.name ?? 'Project');

  return (
    <IonPage>
      <ProjectTopBar
        project={project.data ?? undefined}
        members={memberList}
        onToggleFavorite={() =>
          project.data && favorite.mutate({ id, favorite: !project.data.favorite })
        }
        onCopyLink={() => {
          void navigator.clipboard?.writeText(projectLink(window.location.origin, id));
        }}
        onDuplicate={() => project.data && actions.duplicate.mutate(project.data)}
        onArchive={actions.archiveAndLeave}
        onDelete={actions.deleteAndLeave}
      />
      <IonContent className="ion-padding">
        <div className="board-toolbar">
          <ViewToggle mode={mode} onChange={choose} />
          <CollapseAllButton sectionIds={board.columns.map((c) => c.section.id)} />
        </div>
        <FilterBar
          filter={filter}
          labels={board.labels}
          members={memberList}
          customFields={customFields}
          onChange={update}
        />
        <SavedViewsRegion projectId={id} filter={filter} onApply={replace} />
        <ProjectSelectionBar
          bulk={bulk}
          sections={board.columns.map((c) => c.section)}
          members={memberList}
          labels={board.labels}
        />
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
        <ProjectHeaderRegion
          id={id}
          project={project.data ?? undefined}
          members={memberList}
          edit={edit}
          onAddSection={(name) => board.addSection.mutate(name)}
        />
      </IonContent>
    </IonPage>
  );
}
