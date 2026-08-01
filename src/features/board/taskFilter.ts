import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone, type Priority } from '../task/taskMeta';
import { readCustomValues } from '../customfields/customValues';
import { sortColumn } from './sortColumn';

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
  /** Custom-field filter: only tasks whose `customFieldId` value equals
   * `customValue` (both empty = any). */
  customFieldId: string;
  customValue: string;
  /** Sort order applied within each column. */
  sort: SortKey;
}

export const DEFAULT_FILTER: BoardFilter = {
  hideDone: true,
  labelId: '',
  priority: '',
  dueWindow: '',
  assignee: '',
  customFieldId: '',
  customValue: '',
  sort: 'manual',
};

/** How many narrowing facets are active (label / priority / due window /
 * assignee / custom field). Excludes hideDone + sort, which are always-present
 * view controls, not "filters" the user needs reminding to clear. Pure. */
export function activeFilterCount(filter: BoardFilter): number {
  const facets = [filter.labelId, filter.priority, filter.dueWindow, filter.assignee];
  return facets.filter(Boolean).length + (filter.customValue ? 1 : 0);
}

/** Reset only the narrowing facets, preserving hideDone + sort. Pure. */
export function clearedFilter(filter: BoardFilter): BoardFilter {
  return {
    ...filter,
    labelId: '',
    priority: '',
    dueWindow: '',
    assignee: '',
    customFieldId: '',
    customValue: '',
  };
}

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
  if (filter.customValue && readCustomValues(task)[filter.customFieldId] !== filter.customValue)
    return false;
  return matchesAssignee(task, filter.assignee);
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
