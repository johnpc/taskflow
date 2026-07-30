import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { ListRow } from '../task/ListRow';
import { AddCard } from './AddCard';
import { useSectionCollapse } from './useSectionCollapse';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { Column } from './taskGrouping';
import type { QuickEditFn } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** One section in the List view: a collapsible header (name + count) over
 * aligned task rows (Task/Assignee/Due/Priority columns), with an inline add at
 * the bottom. Same data + mutations as a board column, laid out as a table. */
export function ListSection({
  column,
  labels = [],
  blockedIds,
  subtaskProgress,
  defaultOpen = true,
  onAddTask,
  onToggleDone,
  onQuickEdit,
  selectedIds,
  onSelect,
}: {
  column: Column;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  defaultOpen?: boolean;
  onAddTask: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onQuickEdit?: QuickEditFn;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
}) {
  const { open, toggle } = useSectionCollapse(column.section.id, defaultOpen);
  const nextOrder = column.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;

  return (
    <section className="list-section" data-testid="list-section" aria-label={column.section.name}>
      <button
        type="button"
        className="list-section__head"
        data-testid="list-section-toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <span className="list-section__name">{column.section.name}</span>
        <span className="list-section__count">{column.tasks.length}</span>
      </button>
      {open && (
        <>
          {column.tasks.length > 0 && (
            <div className="list-row list-row--head" data-testid="list-head-row" aria-hidden="true">
              <span className="list-row__lead" />
              <span className="list-row__task">Task</span>
              <span className="list-row__assignee">Assignee</span>
              <span className="list-row__due">Due</span>
              <span className="list-row__prio">Priority</span>
            </div>
          )}
          <ul className="list-section__rows">
            {column.tasks.map((task) => (
              <ListRow
                key={task.id}
                task={task}
                labels={resolveLabels(task.labelIds, labels)}
                blocked={blockedIds?.has(task.id)}
                subtasks={subtaskProgress?.get(task.id)}
                onToggleDone={(t) =>
                  onToggleDone({ id: t.id, done: t.status !== 'DONE', now: nowISO() })
                }
                onQuickEdit={onQuickEdit && ((patch) => onQuickEdit(task.id, patch))}
                selected={selectedIds?.has(task.id)}
                onSelect={onSelect && (() => onSelect(task.id))}
              />
            ))}
          </ul>
          <AddCard
            busy={false}
            onAdd={(title) => onAddTask({ sectionId: column.section.id, title, order: nextOrder })}
          />
        </>
      )}
    </section>
  );
}
