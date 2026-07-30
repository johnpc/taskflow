import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { ListRow } from '../task/ListRow';
import { ListHeaderRow } from './ListHeaderRow';
import { AddCard } from './AddCard';
import { useSectionCollapse } from './useSectionCollapse';
import { sortListRows } from './listSort';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { ListGroup } from './listGrouping';
import type { ListSort, ListSortKey } from './listSort';
import type { QuickEditFn } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** One group in the List view: a collapsible header (name + count) over aligned
 * task rows (Task/Assignee/Due/Priority columns) under a sortable column header.
 * When grouped by Section, an inline add-task composer appends to that section
 * (onAddTask given); other group-by fields omit it (no unambiguous target). */
export function ListSection({
  group,
  labels = [],
  blockedIds,
  subtaskProgress,
  members = [],
  defaultOpen = true,
  sort,
  onSort,
  onAddTask,
  onToggleDone,
  onQuickEdit,
  selectedIds,
  onSelect,
}: {
  group: ListGroup;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  members?: string[];
  defaultOpen?: boolean;
  sort?: ListSort;
  onSort?: (key: ListSortKey) => void;
  onAddTask?: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onQuickEdit?: QuickEditFn;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
}) {
  const { open, toggle } = useSectionCollapse(group.id, defaultOpen);
  const nextOrder = group.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
  const rows = sort ? sortListRows(group.tasks, sort) : group.tasks;

  return (
    <section className="list-section" data-testid="list-section" aria-label={group.name}>
      <button
        type="button"
        className="list-section__head"
        data-testid="list-section-toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <span className="list-section__name">{group.name}</span>
        <span className="list-section__count">{group.tasks.length}</span>
      </button>
      {open && (
        <>
          {group.tasks.length > 0 && <ListHeaderRow sort={sort} onSort={onSort} />}
          <ul className="list-section__rows">
            {rows.map((task) => (
              <ListRow
                key={task.id}
                task={task}
                labels={resolveLabels(task.labelIds, labels)}
                blocked={blockedIds?.has(task.id)}
                subtasks={subtaskProgress?.get(task.id)}
                members={members}
                onToggleDone={(t) =>
                  onToggleDone({ id: t.id, done: t.status !== 'DONE', now: nowISO() })
                }
                onQuickEdit={onQuickEdit && ((patch) => onQuickEdit(task.id, patch))}
                selected={selectedIds?.has(task.id)}
                onSelect={onSelect && (() => onSelect(task.id))}
              />
            ))}
          </ul>
          {onAddTask && (
            <AddCard
              busy={false}
              onAdd={(title) => onAddTask({ sectionId: group.id, title, order: nextOrder })}
            />
          )}
        </>
      )}
    </section>
  );
}
