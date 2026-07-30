import type { TaskRecord } from '../../lib/dataClient';

/** Narrow My Tasks to only the tasks assigned to the given user. When `on` is
 * false (or there's no signed-in email), returns the list unchanged — so a solo
 * user who never assigns anything still sees everything. Pure + total. Used
 * before bucketing so every group + count reflects the filter. */
export function filterAssignedToMe(
  tasks: TaskRecord[],
  email: string | null,
  on: boolean,
): TaskRecord[] {
  if (!on || !email) return tasks;
  return tasks.filter((t) => t.assigneeEmail === email);
}
