import type { BoardFilter } from './taskFilter';
import type { CustomFieldRecord } from '../../lib/dataClient';

/** Board/list filter facet for a SELECT custom field: pick the field, then one
 * of its options. Only SELECT fields (which have a fixed option set) are
 * offered — free-text/number/date values aren't a useful equality filter.
 * Renders nothing when the project has no select fields. Presentational. */
export function CustomFieldFacet({
  fields,
  filter,
  onChange,
}: {
  fields: CustomFieldRecord[];
  filter: BoardFilter;
  onChange: (patch: Partial<BoardFilter>) => void;
}) {
  const selectFields = fields.filter((f) => f.fieldType === 'SELECT');
  if (selectFields.length === 0) return null;
  const active = selectFields.find((f) => f.id === filter.customFieldId);
  const options = (active?.options ?? []).filter((o): o is string => !!o);

  return (
    <>
      <select
        className="filter-bar__select"
        data-testid="filter-cf-field"
        aria-label="Filter by custom field"
        value={filter.customFieldId}
        onChange={(e) => onChange({ customFieldId: e.target.value, customValue: '' })}
      >
        <option value="">Any field</option>
        {selectFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {active && (
        <select
          className="filter-bar__select"
          data-testid="filter-cf-value"
          aria-label={`Filter by ${active.name}`}
          value={filter.customValue}
          onChange={(e) => onChange({ customValue: e.target.value })}
        >
          <option value="">Any {active.name}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
