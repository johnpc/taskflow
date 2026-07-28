import { useCallback, useState } from 'react';
import { DEFAULT_FILTER, type BoardFilter } from './taskFilter';

/** Local board filter/sort state + partial-update setter. Kept in memory (resets
 * on navigation) — a lightweight view control, not persisted like the board/list
 * choice. */
export function useBoardFilter() {
  const [filter, setFilter] = useState<BoardFilter>(DEFAULT_FILTER);
  const update = useCallback(
    (patch: Partial<BoardFilter>) => setFilter((f) => ({ ...f, ...patch })),
    [],
  );
  return { filter, update };
}
