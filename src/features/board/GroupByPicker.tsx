import { GROUP_BY_LABELS, type GroupBy } from './listGrouping';

const OPTIONS = Object.keys(GROUP_BY_LABELS) as GroupBy[];

/** The List-view "Group by" control: a small select that re-buckets rows by
 * Section / Assignee / Due date / Priority. Presentational; the choice is owned
 * and persisted by the caller. */
export function GroupByPicker({
  value,
  onChange,
}: {
  value: GroupBy;
  onChange: (by: GroupBy) => void;
}) {
  return (
    <label className="list-group-by" data-testid="list-group-by">
      <span className="list-group-by__label">Group by</span>
      <select
        className="list-group-by__select"
        data-testid="list-group-by-select"
        aria-label="Group tasks by"
        value={value}
        onChange={(e) => onChange(e.target.value as GroupBy)}
      >
        {OPTIONS.map((key) => (
          <option key={key} value={key}>
            {GROUP_BY_LABELS[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
