import { AddCard } from './AddCard';
import { BoardColumnHead } from './BoardColumnHead';
import { ColumnCards } from './ColumnCards';
import { useSectionCollapse } from './useSectionCollapse';
import type { Column } from './taskGrouping';
// prettier-ignore
import type { AddTaskFn, ToggleDoneFn, ReorderFn, QuickEditFn, BoardDrag, SectionHandlers } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** One board column: a section header (with rename/delete), its task cards, and
 * an inline add-card composer. New cards append after the current highest
 * sortOrder. Renders + delegates its mutations up to the board hook. */
export function BoardColumn({
  column,
  labels = [],
  blockedIds,
  subtaskProgress,
  onAddTask,
  onToggleDone,
  onReorder,
  onQuickEdit,
  sections,
  drag,
  selectedIds,
  onSelect,
}: {
  column: Column;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  onAddTask: AddTaskFn;
  onToggleDone: ToggleDoneFn;
  onReorder?: ReorderFn;
  onQuickEdit?: QuickEditFn;
  sections?: SectionHandlers;
  drag?: BoardDrag;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
}) {
  const sectionId = column.section.id;
  const { open, toggle } = useSectionCollapse(sectionId, true);
  const nextOrder = column.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
  const dropProps = drag
    ? {
        onDragOver: (e: React.DragEvent) => e.preventDefault(),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          drag.onDropToSection(sectionId);
        },
      }
    : {};
  return (
    <section
      className="board-col"
      data-testid="board-column"
      aria-label={column.section.name}
      {...dropProps}
    >
      <BoardColumnHead column={column} open={open} onToggle={toggle} sections={sections} />
      {open && (
        <>
          <ColumnCards
            column={column}
            labels={labels}
            blockedIds={blockedIds}
            subtaskProgress={subtaskProgress}
            onToggleDone={onToggleDone}
            onReorder={onReorder}
            onQuickEdit={onQuickEdit}
            drag={drag}
            selectedIds={selectedIds}
            onSelect={onSelect}
          />
          <AddCard
            busy={false}
            onAdd={(title) => onAddTask({ sectionId, title, order: nextOrder })}
          />
        </>
      )}
    </section>
  );
}
