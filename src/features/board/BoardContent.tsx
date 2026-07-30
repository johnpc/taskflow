import { BoardColumn } from './BoardColumn';
import { ListView } from './ListView';
import type { Column } from './taskGrouping';
import type { ViewMode } from './viewMode';
import type { GroupBy } from './listGrouping';
import type { AddTaskFn, ToggleDoneFn, ReorderFn, QuickEditFn, BoardDrag } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** Renders the project's sections either as horizontal board columns or as a
 * grouped, columnar List view, per the chosen view mode. Passes the label
 * registry + reorder + quick-edit + section/group handlers down. */
export function BoardContent({
  mode,
  columns,
  groupBy = 'SECTION',
  onGroupBy = () => {},
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
  groupBy?: GroupBy;
  onGroupBy?: (by: GroupBy) => void;
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
      <ListView
        columns={columns}
        groupBy={groupBy}
        onGroupBy={onGroupBy}
        labels={labels}
        blockedIds={blockedIds}
        subtaskProgress={subtaskProgress}
        onAddTask={onAddTask}
        onToggleDone={onToggleDone}
        onQuickEdit={onQuickEdit}
        selectedIds={selectedIds}
        onSelect={onSelect}
      />
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
