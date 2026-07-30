import { FilterFacets } from './FilterFacets';
import type { BoardFilter, SortKey } from './taskFilter';
import type { LabelRecord } from '../../lib/dataClient';
import './board.css';

/** Board controls: show/hide completed, filter by label / priority / due window,
 * and sort. Presentational — reports partial filter updates to the parent
 * (useBoardFilter). Shared by the board and the list view. */
export function FilterBar({
  filter,
  labels,
  onChange,
}: {
  filter: BoardFilter;
  labels: LabelRecord[];
  onChange: (patch: Partial<BoardFilter>) => void;
}) {
  return (
    <div className="filter-bar" data-testid="filter-bar">
      <button
        type="button"
        className={filter.hideDone ? 'filter-bar__chip' : 'filter-bar__chip filter-bar__chip--on'}
        data-testid="toggle-completed"
        aria-pressed={!filter.hideDone}
        onClick={() => onChange({ hideDone: !filter.hideDone })}
      >
        {filter.hideDone ? 'Show completed' : 'Hide completed'}
      </button>
      <select
        className="filter-bar__select"
        data-testid="filter-label"
        value={filter.labelId}
        onChange={(e) => onChange({ labelId: e.target.value })}
      >
        <option value="">All labels</option>
        {labels.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <FilterFacets filter={filter} onChange={onChange} />
      <select
        className="filter-bar__select"
        data-testid="filter-sort"
        value={filter.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortKey })}
      >
        <option value="manual">Manual order</option>
        <option value="due">Sort by due date</option>
        <option value="priority">Sort by priority</option>
      </select>
    </div>
  );
}
