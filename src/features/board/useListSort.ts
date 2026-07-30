import { useCallback, useState } from 'react';
import { readListSort, writeListSort } from './listSortStore';
import { toggleListSort, type ListSort, type ListSortKey } from './listSort';

/** List-view sort state for a project, seeded from + persisted to localStorage
 * keyed by project id. `toggle` activates a column ascending, or flips its
 * direction when already active. */
export function useListSort(projectId: string) {
  const [sort, setSort] = useState<ListSort>(() => readListSort(projectId));

  const toggle = useCallback(
    (key: ListSortKey) => {
      setSort((prev) => {
        const next = toggleListSort(prev, key);
        writeListSort(projectId, next);
        return next;
      });
    },
    [projectId],
  );

  return { sort, toggle };
}
