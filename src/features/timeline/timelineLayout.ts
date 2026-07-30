import { isDone } from '../task/taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** A task placed on the timeline: its bar starts `offset` days into the window
 * and spans `span` days (>=1). Clamped to the window so partially-outside bars
 * still show. */
export interface TimelineBar {
  task: TaskRecord;
  offset: number;
  span: number;
}

/** Whole-day difference b - a for YYYY-MM-DD strings (UTC, calendar days). */
function dayDiff(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Lay out a project's OPEN, dated tasks as bars across a `days`-wide window
 * starting at `windowStart` (YYYY-MM-DD). A task's bar runs from its start date
 * (or due date if no start) to its due date. Tasks with no due date, or whose
 * span falls entirely outside the window, are dropped. Pure + total. */
export function timelineLayout(
  tasks: TaskRecord[],
  windowStart: string,
  days: number,
): TimelineBar[] {
  const bars: TimelineBar[] = [];
  for (const task of tasks) {
    if (isDone(task) || !task.dueDate || task.parentTaskId) continue;
    const start = task.startDate ?? task.dueDate;
    const rawStart = dayDiff(windowStart, start);
    const rawEnd = dayDiff(windowStart, task.dueDate); // inclusive last day
    const clampedStart = Math.max(0, rawStart);
    const clampedEnd = Math.min(days - 1, rawEnd);
    if (clampedEnd < clampedStart) continue; // entirely outside the window
    bars.push({ task, offset: clampedStart, span: clampedEnd - clampedStart + 1 });
  }
  return bars.sort((a, b) => a.offset - b.offset || a.span - b.span);
}
