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
import { useBoardFilter } from './useBoardFilter';
import { useProjectEdit } from './useProjectEdit';
import { ViewToggle } from './ViewToggle';
import { FilterBar } from './FilterBar';
import { ProjectHeader } from './ProjectHeader';
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
  const { filter, update } = useBoardFilter();
  const board = useBoard(id, filter);
  const { query, columns, addTask, toggleDone, reorder, labels } = board;
  const { addSection, editSection, removeSection } = board;
  const { mode, choose } = useViewMode(id, project.data?.view as ViewMode | undefined);
  const edit = useProjectEdit(id);
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
        {project.data && (
          <ProjectHeader
            project={project.data}
            onDescribe={(description) => edit.mutate({ id, description })}
            onAddSection={(name) => addSection.mutate(name)}
          />
        )}
        <ViewToggle mode={mode} onChange={choose} />
        <FilterBar filter={filter} labels={labels} onChange={update} />
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
            onReorder={(input) => reorder.mutate(input)}
            onRenameSection={(input) => editSection.mutate(input)}
            onDeleteSection={(sectionId) => removeSection.mutate(sectionId)}
          />
        </LoadState>
      </IonContent>
    </IonPage>
  );
}
