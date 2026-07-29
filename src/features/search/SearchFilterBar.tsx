import { PRIORITY_META, type Priority } from '../task/taskMeta';
import type { SearchFilters } from './matchTasks';

const PRIORITIES: (Priority | '')[] = ['', 'HIGH', 'MEDIUM', 'LOW'];
const labelFor = (p: Priority | '') => (p === '' ? 'Any' : PRIORITY_META[p].label);

/** Search filter row: a priority chip set (Any/High/Medium/Low) plus a
 * hide-completed toggle. Renders only; the chosen filters are owned by
 * useSearch and applied after the text match. */
export function SearchFilterBar({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) {
  return (
    <div className="search__filters" data-testid="search-filters">
      <div className="search__prios" role="group" aria-label="Filter by priority">
        {PRIORITIES.map((p) => (
          <button
            key={p || 'any'}
            type="button"
            data-testid={`search-prio-${p ? p.toLowerCase() : 'any'}`}
            className={filters.priority === p ? 'search__prio search__prio--on' : 'search__prio'}
            aria-pressed={filters.priority === p}
            onClick={() => onChange({ ...filters, priority: p })}
          >
            {labelFor(p)}
          </button>
        ))}
      </div>
      <label className="search__hide-done">
        <input
          type="checkbox"
          data-testid="search-hide-done"
          checked={filters.hideDone}
          onChange={(e) => onChange({ ...filters, hideDone: e.target.checked })}
        />
        Hide completed
      </label>
    </div>
  );
}
