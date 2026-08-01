import type { ListSort, ListSortKey } from '../board/listSort';

const OPTIONS: { key: ListSortKey; label: string }[] = [
  { key: 'manual', label: 'Default order' },
  { key: 'due', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'title', label: 'Title' },
];

/** Within-bucket sort control for My Tasks: a column select + an asc/desc
 * toggle (hidden while on 'manual', which keeps each grouping's own order).
 * Presentational — reports the new ListSort up. */
export function MyTasksSort({
  sort,
  onChange,
}: {
  sort: ListSort;
  onChange: (s: ListSort) => void;
}) {
  return (
    <div className="mytasks__sort" data-testid="mytasks-sort">
      <select
        className="filter-bar__select"
        data-testid="mytasks-sort-key"
        aria-label="Sort tasks within each group"
        value={sort.key}
        onChange={(e) => onChange({ key: e.target.value as ListSortKey, dir: sort.dir })}
      >
        {OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      {sort.key !== 'manual' && (
        <button
          type="button"
          className="filter-bar__chip"
          data-testid="mytasks-sort-dir"
          aria-label={sort.dir === 'asc' ? 'Ascending' : 'Descending'}
          onClick={() => onChange({ key: sort.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' })}
        >
          {sort.dir === 'asc' ? '↑' : '↓'}
        </button>
      )}
    </div>
  );
}
