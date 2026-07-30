import { PRIORITY_META, type Priority } from '../task/taskMeta';
import type { BoardFilter, DueWindow } from './taskFilter';

const PRIORITIES: Priority[] = ['HIGH', 'MEDIUM', 'LOW', 'NONE'];
const DUE_WINDOWS: { value: DueWindow; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'upcoming', label: 'Upcoming' },
];

/** The priority + due-window + assignee facet selects for the board/list filter
 * bar. Presentational; reports partial filter updates. Split from FilterBar to
 * keep each component focused. The assignee select only renders for a shared
 * project (>1 member) — there's nothing to filter by when you're solo. */
export function FilterFacets({
  filter,
  members = [],
  onChange,
}: {
  filter: BoardFilter;
  members?: string[];
  onChange: (patch: Partial<BoardFilter>) => void;
}) {
  return (
    <>
      <select
        className="filter-bar__select"
        data-testid="filter-priority"
        aria-label="Filter by priority"
        value={filter.priority}
        onChange={(e) => onChange({ priority: e.target.value as Priority | '' })}
      >
        <option value="">Any priority</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_META[p].label}
          </option>
        ))}
      </select>
      <select
        className="filter-bar__select"
        data-testid="filter-due"
        aria-label="Filter by due window"
        value={filter.dueWindow}
        onChange={(e) => onChange({ dueWindow: e.target.value as DueWindow })}
      >
        <option value="">Any due date</option>
        {DUE_WINDOWS.map((w) => (
          <option key={w.value} value={w.value}>
            {w.label}
          </option>
        ))}
      </select>
      {members.length > 1 && (
        <select
          className="filter-bar__select"
          data-testid="filter-assignee"
          aria-label="Filter by assignee"
          value={filter.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
        >
          <option value="">Any assignee</option>
          <option value="_none">Unassigned</option>
          {members.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
