import { BoardColumn } from './BoardColumn';
import { ListSection } from './ListSection';
import type { Column } from './taskGrouping';
import type { ViewMode } from './viewMode';

type AddTask = (input: { sectionId: string; title: string; order: number }) => void;
type ToggleDone = (input: { id: string; done: boolean; now: string }) => void;

/** Renders the project's sections either as horizontal board columns or as a
 * vertical list of collapsible sections, per the chosen view mode. Shared by
 * ProjectView so the screen stays a thin shell. */
export function BoardContent({
  mode,
  columns,
  onAddTask,
  onToggleDone,
}: {
  mode: ViewMode;
  columns: Column[];
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
          onAddTask={onAddTask}
          onToggleDone={onToggleDone}
        />
      ))}
    </div>
  );
}
