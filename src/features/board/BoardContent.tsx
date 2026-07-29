import { BoardColumn } from './BoardColumn';
import { ListSection } from './ListSection';
import type { Column } from './taskGrouping';
import type { ViewMode } from './viewMode';
import type { AddTaskFn, ToggleDoneFn, ReorderFn, QuickEditFn, BoardDrag } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** Renders the project's sections either as horizontal board columns or as a
 * vertical list of collapsible sections, per the chosen view mode. Passes the
 * label registry + reorder + quick-edit + section handlers down. */
export function BoardContent({
  mode,
  columns,
  labels = [],
  blockedIds,
  subtaskProgress,
  onAddTask,
  onToggleDone,
  onReorder,
  onQuickEdit,
  onRenameSection,
  onDeleteSection,
  onMoveSection,
  selectedIds,
  onSelect,
  drag,
}: {
  mode: ViewMode;
  columns: Column[];
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  onAddTask: AddTaskFn;
  onToggleDone: ToggleDoneFn;
  onReorder?: ReorderFn;
  onQuickEdit?: QuickEditFn;
  onRenameSection?: (input: { id: string; name: string }) => void;
  onDeleteSection?: (id: string) => void;
  onMoveSection?: (input: { sectionId: string; direction: 'left' | 'right' }) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
  drag?: BoardDrag;
}) {
  if (mode === 'LIST') {
    return (
      <div className="list-view" data-testid="list-view">
        {columns.map((column, i) => (
          <ListSection
            key={column.section.id}
            column={column}
            labels={labels}
            blockedIds={blockedIds}
            subtaskProgress={subtaskProgress}
            defaultOpen={i === 0 || column.tasks.length > 0}
            onAddTask={onAddTask}
            onToggleDone={onToggleDone}
            onReorder={onReorder}
            onQuickEdit={onQuickEdit}
            selectedIds={selectedIds}
            onSelect={onSelect}
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
          blockedIds={blockedIds}
          subtaskProgress={subtaskProgress}
          onAddTask={onAddTask}
          onToggleDone={onToggleDone}
          onReorder={onReorder}
          onQuickEdit={onQuickEdit}
          onRenameSection={onRenameSection}
          onDeleteSection={onDeleteSection}
          onMoveSection={onMoveSection}
          drag={drag}
        />
      ))}
    </div>
  );
}
