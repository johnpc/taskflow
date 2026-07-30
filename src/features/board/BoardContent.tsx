import { BoardGrid } from './BoardGrid';
import { ListView } from './ListView';
import { TimelineView } from '../timeline/TimelineView';
import type { Column } from './taskGrouping';
import type { ViewMode } from './viewMode';
import type { GroupBy } from './listGrouping';
import type { ListSort, ListSortKey } from './listSort';
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
  sort,
  onSort,
  labels = [],
  blockedIds,
  subtaskProgress,
  members = [],
  onAddTask,
  onToggleDone,
  onReorder,
  onQuickEdit,
  onReschedule,
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
  sort?: ListSort;
  onSort?: (key: ListSortKey) => void;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  members?: string[];
  onAddTask: AddTaskFn;
  onToggleDone: ToggleDoneFn;
  onReorder?: ReorderFn;
  onQuickEdit?: QuickEditFn;
  onReschedule?: (patch: { id: string; dueDate: string; startDate?: string }) => void;
  onRenameSection?: (input: { id: string; name: string }) => void;
  onDeleteSection?: (id: string) => void;
  onMoveSection?: (input: { sectionId: string; direction: 'left' | 'right' }) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
  drag?: BoardDrag;
}) {
  if (mode === 'TIMELINE') {
    return <TimelineView columns={columns} onReschedule={onReschedule} />;
  }
  if (mode === 'LIST') {
    return (
      <ListView
        columns={columns}
        groupBy={groupBy}
        onGroupBy={onGroupBy}
        sort={sort}
        onSort={onSort}
        labels={labels}
        blockedIds={blockedIds}
        subtaskProgress={subtaskProgress}
        members={members}
        onAddTask={onAddTask}
        onToggleDone={onToggleDone}
        onQuickEdit={onQuickEdit}
        selectedIds={selectedIds}
        onSelect={onSelect}
      />
    );
  }
  return (
    <BoardGrid
      columns={columns}
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
  );
}
