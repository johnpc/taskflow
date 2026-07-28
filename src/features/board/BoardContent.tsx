import { BoardColumn } from './BoardColumn';
import { ListSection } from './ListSection';
import type { Column } from './taskGrouping';
import type { ViewMode } from './viewMode';
import type { LabelRecord } from '../../lib/dataClient';

type AddTask = (input: { sectionId: string; title: string; order: number }) => void;
type ToggleDone = (input: { id: string; done: boolean; now: string }) => void;

/** Renders the project's sections either as horizontal board columns or as a
 * vertical list of collapsible sections, per the chosen view mode. Passes the
 * label registry down so cards can render their chips. Shared by ProjectView. */
export function BoardContent({
  mode,
  columns,
  labels = [],
  onAddTask,
  onToggleDone,
}: {
  mode: ViewMode;
  columns: Column[];
  labels?: LabelRecord[];
  onAddTask: AddTask;
  onToggleDone: ToggleDone;
}) {
  if (mode === 'LIST') {
    return (
      <div className="list-view" data-testid="list-view">
        {columns.map((column, i) => (
          <ListSection
            key={column.section.id}
            column={column}
            labels={labels}
            defaultOpen={i === 0 || column.tasks.length > 0}
            onAddTask={onAddTask}
            onToggleDone={onToggleDone}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="board" data-testid="board">
      {columns.map((column) => (
        <BoardColumn
          key={column.section.id}
          column={column}
          labels={labels}
          onAddTask={onAddTask}
          onToggleDone={onToggleDone}
        />
      ))}
    </div>
  );
}
