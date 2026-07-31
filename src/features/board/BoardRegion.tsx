import { BoardContent } from './BoardContent';
import { LoadState } from '../shell/LoadState';
import { useBoardDrag } from './useBoardDrag';
import { useToast } from '../shell/useToast';
import { useCelebration } from '../celebration/useCelebration';
import { nowISO } from '../task/today';
import type { useBoard } from './useBoard';
import type { useBulkSelection } from './useBulkSelection';
import type { ViewMode } from './viewMode';
import type { GroupBy } from './listGrouping';
import type { ListSort, ListSortKey } from './listSort';

/** The load-gated board/list region of ProjectView: wires every board mutation
 * to BoardContent, threads list-mode multi-select + group-by + sort, and drives
 * board drag-and-drop (drop a card on a column to move it; onto a card to
 * reorder). Split out to keep the screen shell under the line limit. */
export function BoardRegion({
  board,
  mode,
  bulk,
  members = [],
  groupBy = 'SECTION',
  onGroupBy = () => {},
  sort,
  onSort,
}: {
  board: ReturnType<typeof useBoard>;
  mode: ViewMode;
  bulk: ReturnType<typeof useBulkSelection>;
  members?: string[];
  groupBy?: GroupBy;
  onGroupBy?: (by: GroupBy) => void;
  sort?: ListSort;
  onSort?: (key: ListSortKey) => void;
}) {
  const { query, columns } = board;
  const inList = mode === 'LIST';
  const { showUndo } = useToast();
  const { celebrate } = useCelebration();
  // Completing a task hides it (hide-completed default); offer a one-tap undo +
  // an occasional confetti celebration.
  const toggleDone = (input: { id: string; done: boolean; now: string }) => {
    board.toggleDone.mutate(input);
    if (input.done) {
      celebrate();
      showUndo({
        message: 'Task completed',
        onUndo: () => board.toggleDone.mutate({ id: input.id, done: false, now: nowISO() }),
      });
    }
  };
  const drag = useBoardDrag(columns, (p) => board.quickEdit.mutate(p));
  return (
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
        members={members}
        groupBy={groupBy}
        onGroupBy={onGroupBy}
        sort={sort}
        onSort={onSort}
        labels={board.labels}
        blockedIds={board.blockedIds}
        subtaskProgress={board.subtaskProgress}
        onAddTask={(input) => board.addTask.mutate(input)}
        onToggleDone={toggleDone}
        onReorder={(input) => board.reorder.mutate(input)}
        onQuickEdit={(taskId, patch) => board.quickEdit.mutate({ id: taskId, ...patch })}
        onReschedule={(patch) => board.quickEdit.mutate(patch)}
        sectionHandlers={{
          onRename: (input) => board.editSection.mutate(input),
          onDuplicate: (section) => board.copySection.mutate(section),
          onDelete: (sectionId) => board.removeSection.mutate(sectionId),
          onMove: (input) => board.moveSection.mutate(input),
        }}
        selectedIds={bulk.selection.ids}
        onSelect={bulk.selection.toggle}
        drag={inList ? undefined : drag}
      />
    </LoadState>
  );
}
