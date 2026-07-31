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
  /** Only tasks assigned to this email (empty = any; '_none' = unassigned). */
  assignee: string;
  /** Sort order applied within each column. */
  sort: SortKey;
}

export const DEFAULT_FILTER: BoardFilter = {
  hideDone: true,
  labelId: '',
  priority: '',
  dueWindow: '',
  assignee: '',
  sort: 'manual',
};

/** How many narrowing facets are active (label / priority / due window /
 * assignee). Excludes hideDone + sort, which are always-present view controls,
 * not "filters" the user needs reminding to clear. Pure. */
export function activeFilterCount(filter: BoardFilter): number {
  return [filter.labelId, filter.priority, filter.dueWindow, filter.assignee].filter(Boolean)
    .length;
}

/** Reset only the narrowing facets, preserving hideDone + sort. Pure. */
export function clearedFilter(filter: BoardFilter): BoardFilter {
  return { ...filter, labelId: '', priority: '', dueWindow: '', assignee: '' };
}

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };

/** Whether a task passes the chosen assignee filter ('' = any, '_none' =
 * unassigned, otherwise an exact email). */
function matchesAssignee(task: TaskRecord, assignee: string): boolean {
  if (!assignee) return true;
  return assignee === '_none' ? !task.assigneeEmail : task.assigneeEmail === assignee;
}

/** Whether a single task passes every active filter facet. Pure; `today` feeds
 * the due-window test. Split from applyFilter to keep each function's CRAP low. */
function matchesFilter(task: TaskRecord, filter: BoardFilter, today: string): boolean {
  if (filter.hideDone && isDone(task)) return false;
  if (filter.labelId && !(task.labelIds ?? []).includes(filter.labelId)) return false;
  if (filter.priority && (task.priority ?? 'NONE') !== filter.priority) return false;
  if (filter.dueWindow && dueStatus(task.dueDate, today, isDone(task)) !== filter.dueWindow)
    return false;
  return matchesAssignee(task, filter.assignee);
}

/** Order a filtered column by the chosen sort key (manual keeps input order). */
function sortColumn(tasks: TaskRecord[], sort: SortKey): TaskRecord[] {
  const out = [...tasks];
  if (sort === 'due') {
    out.sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  } else if (sort === 'priority') {
    const rank = (p?: string | null) => PRIORITY_RANK[p ?? 'NONE'] ?? 3;
    out.sort((a, b) => rank(a.priority) - rank(b.priority));
  }
  return out;
}

/** Apply the filter + sort to a single column's tasks. Pure + total: keeps the
 * rows matching every active facet, then orders by the sort key. `today` is
 * injected for the due-window test. */
export function applyFilter(tasks: TaskRecord[], filter: BoardFilter, today = ''): TaskRecord[] {
  return sortColumn(
    tasks.filter((t) => matchesFilter(t, filter, today)),
    filter.sort,
  );
}
