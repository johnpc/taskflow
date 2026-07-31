import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { AddCard } from './AddCard';
import { SectionActions } from './SectionActions';
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
      <header className="board-col__head">
        <button
          type="button"
          className="board-col__toggle"
          data-testid="board-col-toggle"
          aria-expanded={open}
          aria-label={open ? `Collapse ${column.section.name}` : `Expand ${column.section.name}`}
          onClick={toggle}
        >
          <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        </button>
        <span className="board-col__name">{column.section.name}</span>
        <span className="board-col__count">{column.tasks.length}</span>
        <SectionActions
          name={column.section.name}
          onRename={sections?.onRename && ((name) => sections.onRename!({ id: sectionId, name }))}
          onDuplicate={sections?.onDuplicate && (() => sections.onDuplicate!(column.section))}
          onDelete={sections?.onDelete && (() => sections.onDelete!(sectionId))}
          onMove={sections?.onMove && ((direction) => sections.onMove!({ sectionId, direction }))}
        />
      </header>
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
