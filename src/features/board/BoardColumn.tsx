import { AddCard } from './AddCard';
import { SectionActions } from './SectionActions';
import { ColumnCards } from './ColumnCards';
import type { Column } from './taskGrouping';
import type { QuickEditFn, BoardDrag } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

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
  onRenameSection,
  onDeleteSection,
  onMoveSection,
  drag,
}: {
  column: Column;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  onAddTask: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onReorder?: (input: {
    columnTasks: TaskRecord[];
    taskId: string;
    direction: 'up' | 'down';
  }) => void;
  onQuickEdit?: QuickEditFn;
  onRenameSection?: (input: { id: string; name: string }) => void;
  onDeleteSection?: (id: string) => void;
  onMoveSection?: (input: { sectionId: string; direction: 'left' | 'right' }) => void;
  drag?: BoardDrag;
}) {
  const sectionId = column.section.id;
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
      <header className="board-col__head">
        <span className="board-col__name">{column.section.name}</span>
        <span className="board-col__count">{column.tasks.length}</span>
        <SectionActions
          name={column.section.name}
          onRename={onRenameSection && ((name) => onRenameSection({ id: column.section.id, name }))}
          onDelete={onDeleteSection && (() => onDeleteSection(column.section.id))}
          onMove={
            onMoveSection &&
            ((direction) => onMoveSection({ sectionId: column.section.id, direction }))
          }
        />
      </header>
      <ColumnCards
        column={column}
        labels={labels}
        blockedIds={blockedIds}
        subtaskProgress={subtaskProgress}
        onToggleDone={onToggleDone}
        onReorder={onReorder}
        onQuickEdit={onQuickEdit}
        drag={drag}
      />
      <AddCard busy={false} onAdd={(title) => onAddTask({ sectionId, title, order: nextOrder })} />
    </section>
  );
}
