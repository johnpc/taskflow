import { ListSection } from './ListSection';
import { GroupByPicker } from './GroupByPicker';
import { AddCard } from './AddCard';
import { groupListBy, type GroupBy } from './listGrouping';
import { DEFAULT_LIST_SORT, type ListSort, type ListSortKey } from './listSort';
import { todayISO } from '../task/today';
import type { Column } from './taskGrouping';
import type { AddTaskFn, ToggleDoneFn, QuickEditFn } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** The List view: a group-by picker over collapsible groups of columnar rows
 * with sortable column headers. Grouped by Section each group has its own inline
 * add-task composer; in every other mode (None/Assignee/Due/Priority) a single
 * top-level composer files new tasks into the first section — so you can always
 * add a task regardless of how the list is grouped. */
export function ListView({
  columns,
  groupBy,
  onGroupBy,
  sort = DEFAULT_LIST_SORT,
  onSort,
  labels = [],
  blockedIds,
  subtaskProgress,
  onAddTask,
  onToggleDone,
  onQuickEdit,
  selectedIds,
  onSelect,
}: {
  columns: Column[];
  groupBy: GroupBy;
  onGroupBy: (by: GroupBy) => void;
  sort?: ListSort;
  onSort?: (key: ListSortKey) => void;
  labels?: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  onAddTask: AddTaskFn;
  onToggleDone: ToggleDoneFn;
  onQuickEdit?: QuickEditFn;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
}) {
  const groups = groupListBy(columns, groupBy, todayISO());
  // When not grouped by section, a new task has no unambiguous target group, so
  // file it into the first section (its next sort order) via one shared composer.
  const firstSection = columns[0]?.section;
  const nextOrder =
    (columns[0]?.tasks.reduce((m, t) => Math.max(m, t.sortOrder ?? 0), -1) ?? -1) + 1;
  return (
    <div className="list-view" data-testid="list-view">
      <GroupByPicker value={groupBy} onChange={onGroupBy} />
      {groups.map((group, i) => (
        <ListSection
          key={group.id}
          group={group}
          labels={labels}
          blockedIds={blockedIds}
          subtaskProgress={subtaskProgress}
          defaultOpen={i === 0 || group.tasks.length > 0}
          sort={sort}
          onSort={onSort}
          onAddTask={groupBy === 'SECTION' ? onAddTask : undefined}
          onToggleDone={onToggleDone}
          onQuickEdit={onQuickEdit}
          selectedIds={selectedIds}
          onSelect={onSelect}
        />
      ))}
      {groupBy !== 'SECTION' && firstSection && (
        <div className="list-view__add">
          <AddCard
            busy={false}
            onAdd={(title) => onAddTask({ sectionId: firstSection.id, title, order: nextOrder })}
          />
        </div>
      )}
    </div>
  );
}
