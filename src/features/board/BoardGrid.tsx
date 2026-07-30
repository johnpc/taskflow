import { BoardColumn } from './BoardColumn';
import type { Column } from './taskGrouping';
import type {
  AddTaskFn,
  ToggleDoneFn,
  ReorderFn,
  QuickEditFn,
  BoardDrag,
  SectionHandlers,
} from './boardHandlers';
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
  sections,
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
  sections?: SectionHandlers;
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
          sections={sections}
          drag={drag}
        />
      ))}
    </div>
  );
}
