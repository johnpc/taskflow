import { DEFAULT_LIST_SORT, type ListSort, type ListSortKey } from './listSort';

/** Per-project List-view sort preference, persisted in localStorage keyed by
 * project id. Stored as "key:dir". Pure helpers so the hook stays thin. */
const key = (projectId: string) => `tf-listsort-${projectId}`;

const KEYS: ListSortKey[] = ['manual', 'title', 'assignee', 'due', 'priority'];

/** Read the stored sort for a project, defaulting to manual/asc. */
export function readListSort(projectId: string): ListSort {
  try {
    const raw = localStorage.getItem(key(projectId));
    if (raw) {
      const [k, dir] = raw.split(':');
      if ((KEYS as string[]).includes(k) && (dir === 'asc' || dir === 'desc')) {
        return { key: k as ListSortKey, dir };
      }
    }
  } catch {
    /* storage unavailable — use the default */
  }
  return DEFAULT_LIST_SORT;
}

/** Persist a project's chosen sort (best-effort). */
export function writeListSort(projectId: string, sort: ListSort): void {
  try {
    localStorage.setItem(key(projectId), `${sort.key}:${sort.dir}`);
  } catch {
    /* ignore */
  }
}
