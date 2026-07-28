import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';

export type SortKey = 'manual' | 'due' | 'priority';

export interface BoardFilter {
  /** Hide completed tasks (default true — Asana hides done by default). */
  hideDone: boolean;
  /** Only tasks carrying this label id (empty = all). */
  labelId: string;
  /** Sort order applied within each column. */
  sort: SortKey;
}

export const DEFAULT_FILTER: BoardFilter = { hideDone: true, labelId: '', sort: 'manual' };

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };

/** Apply the filter + sort to a single column's tasks. Pure + total: hides done
 * (unless disabled), keeps only the chosen label, then orders by the sort key
 * (manual = keep the incoming sortOrder). */
export function applyFilter(tasks: TaskRecord[], filter: BoardFilter): TaskRecord[] {
  let out = tasks;
  if (filter.hideDone) out = out.filter((t) => !isDone(t));
  if (filter.labelId) {
    out = out.filter((t) => (t.labelIds ?? []).includes(filter.labelId));
  }
  const sorted = [...out];
  if (filter.sort === 'due') {
    sorted.sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  } else if (filter.sort === 'priority') {
    sorted.sort(
      (a, b) =>
        (PRIORITY_RANK[a.priority ?? 'NONE'] ?? 3) - (PRIORITY_RANK[b.priority ?? 'NONE'] ?? 3),
    );
  }
  return sorted;
}
