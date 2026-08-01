import { DEFAULT_LIST_SORT, type ListSort, type ListSortKey } from '../board/listSort';

/** The My Tasks within-bucket sort, persisted in localStorage. Reuses the List
 * view's ListSort shape (key + direction) so one sorter serves both. Pure
 * read/write helpers; mirrors the board listSort store. Defaults to manual. */

const KEY = 'tf-mytasks-sort';
const KEYS: ListSortKey[] = ['manual', 'title', 'assignee', 'due', 'priority'];

/** Read the stored sort, defaulting to manual order. */
export function readMyTasksSort(): ListSort {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const [key, dir] = raw.split(':');
      if (KEYS.includes(key as ListSortKey)) {
        return { key: key as ListSortKey, dir: dir === 'desc' ? 'desc' : 'asc' };
      }
    }
  } catch {
    /* storage unavailable — use the default */
  }
  return DEFAULT_LIST_SORT;
}

/** Persist the chosen sort (best-effort). */
export function writeMyTasksSort(sort: ListSort): void {
  try {
    localStorage.setItem(KEY, `${sort.key}:${sort.dir}`);
  } catch {
    /* ignore */
  }
}
