import { BoardContent } from './BoardContent';
import { LoadState } from '../shell/LoadState';
import type { useBoard } from './useBoard';
import type { useBulkSelection } from './useBulkSelection';
import type { ViewMode } from './viewMode';

/** The load-gated board/list region of ProjectView: wires every board mutation
 * to BoardContent and threads list-mode multi-select. Split out to keep the
 * screen shell under the line limit. */
export function BoardRegion({
  board,
  mode,
  bulk,
}: {
  board: ReturnType<typeof useBoard>;
  mode: ViewMode;
  bulk: ReturnType<typeof useBulkSelection>;
}) {
  const { query, columns } = board;
  const inList = mode === 'LIST';
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
        labels={board.labels}
        onAddTask={(input) => board.addTask.mutate(input)}
        onToggleDone={(input) => board.toggleDone.mutate(input)}
        onReorder={(input) => board.reorder.mutate(input)}
        onQuickEdit={(taskId, patch) => board.quickEdit.mutate({ id: taskId, ...patch })}
        onRenameSection={(input) => board.editSection.mutate(input)}
        onDeleteSection={(sectionId) => board.removeSection.mutate(sectionId)}
        onMoveSection={(input) => board.moveSection.mutate(input)}
        selectedIds={inList ? bulk.selection.ids : undefined}
        onSelect={inList ? bulk.selection.toggle : undefined}
      />
    </LoadState>
  );
}
