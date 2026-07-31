import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { SectionActions } from './SectionActions';
import type { Column } from './taskGrouping';
import type { SectionHandlers } from './boardHandlers';

/** A board column's header: collapse toggle, section name + task count, and the
 * rename/duplicate/delete/move actions. Split from BoardColumn to keep it within
 * the line limit. */
export function BoardColumnHead({
  column,
  open,
  onToggle,
  sections,
}: {
  column: Column;
  open: boolean;
  onToggle: () => void;
  sections?: SectionHandlers;
}) {
  const sectionId = column.section.id;
  const name = column.section.name;
  return (
    <header className="board-col__head">
      <button
        type="button"
        className="board-col__toggle"
        data-testid="board-col-toggle"
        aria-expanded={open}
        aria-label={open ? `Collapse ${name}` : `Expand ${name}`}
        onClick={onToggle}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
      </button>
      <span className="board-col__name">{name}</span>
      <span className="board-col__count">{column.tasks.length}</span>
      <SectionActions
        name={name}
        onRename={sections?.onRename && ((n) => sections.onRename!({ id: sectionId, name: n }))}
        onDuplicate={sections?.onDuplicate && (() => sections.onDuplicate!(column.section))}
        onDelete={sections?.onDelete && (() => sections.onDelete!(sectionId))}
        onMove={sections?.onMove && ((direction) => sections.onMove!({ sectionId, direction }))}
      />
    </header>
  );
}
