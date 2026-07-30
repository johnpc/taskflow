import type { ListSort, ListSortKey } from './listSort';

const COLUMNS: { key: ListSortKey; label: string; cls: string }[] = [
  { key: 'title', label: 'Task', cls: 'list-row__task' },
  { key: 'assignee', label: 'Assignee', cls: 'list-row__assignee' },
  { key: 'due', label: 'Due', cls: 'list-row__due' },
  { key: 'priority', label: 'Priority', cls: 'list-row__prio' },
];

/** The List-view column header row. Each column is a button that sorts the list
 * by that column (click again to flip direction); the active column shows a ▲/▼
 * indicator. When onSort is absent the labels render as plain text. */
export function ListHeaderRow({
  sort,
  onSort,
}: {
  sort?: ListSort;
  onSort?: (key: ListSortKey) => void;
}) {
  const indicator = (key: ListSortKey) =>
    sort?.key === key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : '';
  return (
    <div className="list-row list-row--head" data-testid="list-head-row">
      <span className="list-row__lead" />
      {COLUMNS.map((c) =>
        onSort ? (
          <button
            key={c.key}
            type="button"
            className={`${c.cls} list-head__sort`}
            data-testid={`list-sort-${c.key}`}
            aria-pressed={sort?.key === c.key}
            onClick={() => onSort(c.key)}
          >
            {c.label}
            {indicator(c.key)}
          </button>
        ) : (
          <span key={c.key} className={c.cls}>
            {c.label}
          </span>
        ),
      )}
    </div>
  );
}
