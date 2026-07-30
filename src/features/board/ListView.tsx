import { ListSection } from './ListSection';
import { GroupByPicker } from './GroupByPicker';
import { groupListBy, type GroupBy } from './listGrouping';
import { todayISO } from '../task/today';
import type { Column } from './taskGrouping';
import type { AddTaskFn, ToggleDoneFn, QuickEditFn } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord } from '../../lib/dataClient';

/** The List view: a group-by picker over collapsible groups of columnar rows.
 * Grouped by Section (the default) each group is a real section with an inline
 * add-task composer; other group-by fields dynamically re-bucket the tasks and
 * omit add (no unambiguous target section). */
export function ListView({
  columns,
  groupBy,
  onGroupBy,
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
          onAddTask={groupBy === 'SECTION' ? onAddTask : undefined}
          onToggleDone={onToggleDone}
          onQuickEdit={onQuickEdit}
          selectedIds={selectedIds}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
