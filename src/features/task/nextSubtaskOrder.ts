import type { TaskRecord } from '../../lib/dataClient';

/** Next sortOrder for a new subtask: one past the current highest (0 when
 * empty). Pure so subtask ordering is deterministic + testable. */
export function nextSubtaskOrder(subtasks: TaskRecord[]): number {
  return subtasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
}
