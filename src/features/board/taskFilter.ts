import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone, type Priority } from '../task/taskMeta';

export type SortKey = 'manual' | 'due' | 'priority';

/** A due-window filter: overdue, due today, or dated upcoming. */
export type DueWindow = '' | 'overdue' | 'today' | 'upcoming';

export interface BoardFilter {
  /** Hide completed tasks (default true — Asana hides done by default). */
  hideDone: boolean;
  /** Only tasks carrying this label id (empty = all). */
  labelId: string;
  /** Only tasks of this priority (empty = any). */
  priority: Priority | '';
  /** Only tasks in this due window (empty = any). */
  dueWindow: DueWindow;
  /** Sort order applied within each column. */
  sort: SortKey;
}

export const DEFAULT_FILTER: BoardFilter = {
  hideDone: true,
  labelId: '',
  priority: '',
  dueWindow: '',
  sort: 'manual',
};

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };

/** Apply the filter + sort to a single column's tasks. Pure + total: hides done
 * (unless disabled), keeps only the chosen label / priority / due window, then
 * orders by the sort key (manual = keep the incoming sortOrder). `today` is
 * injected for the due-window test. */
export function applyFilter(tasks: TaskRecord[], filter: BoardFilter, today = ''): TaskRecord[] {
  let out = tasks;
  if (filter.hideDone) out = out.filter((t) => !isDone(t));
  if (filter.labelId) {
    out = out.filter((t) => (t.labelIds ?? []).includes(filter.labelId));
  }
  if (filter.priority) {
    out = out.filter((t) => (t.priority ?? 'NONE') === filter.priority);
  }
  if (filter.dueWindow) {
    out = out.filter((t) => dueStatus(t.dueDate, today, isDone(t)) === filter.dueWindow);
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
