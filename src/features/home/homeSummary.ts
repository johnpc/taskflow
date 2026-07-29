import type { TaskRecord } from '../../lib/dataClient';
import { dueStatus, isDone } from '../task/taskMeta';

export interface HomeSummary {
  today: TaskRecord[];
  overdue: number;
  /** Next open, dated tasks (soonest first) — the "coming up" list. */
  upcoming: TaskRecord[];
}

/** Build the home dashboard summary from the owner's tasks: today's open tasks,
 * the overdue count, and the next few upcoming dated tasks. `todayStr` is
 * injected (YYYY-MM-DD) for determinism. Pure + total. */
export function homeSummary(tasks: TaskRecord[], todayStr: string, upcomingLimit = 5): HomeSummary {
  const open = tasks.filter((t) => !isDone(t) && !t.parentTaskId);
  const today = open.filter((t) => dueStatus(t.dueDate, todayStr, false) === 'today');
  const overdue = open.filter((t) => dueStatus(t.dueDate, todayStr, false) === 'overdue').length;
  const upcoming = open
    .filter((t) => dueStatus(t.dueDate, todayStr, false) === 'upcoming' && !!t.dueDate)
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
    .slice(0, upcomingLimit);
  return { today, overdue, upcoming };
}
