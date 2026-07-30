import { BoardColumn } from './BoardColumn';
import type { Column } from './taskGrouping';
import type { AddTaskFn, ToggleDoneFn, ReorderFn, QuickEditFn, BoardDrag } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** The Kanban board: the project's sections as horizontal columns. Split from
 * BoardContent (which just dispatches by view mode) so each stays a thin unit. */
export function BoardGrid({
  columns,
  labels,
  blockedIds,
  subtaskProgress,
  onAddTask,
  onToggleDone,
  onReorder,
  onQuickEdit,
  onRenameSection,
  onDeleteSection,
  onMoveSection,
  drag,
}: {
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
  drag?: BoardDrag;
}) {
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
