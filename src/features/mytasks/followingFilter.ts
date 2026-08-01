import type { TaskRecord } from '../../lib/dataClient';
import { isFollowing } from '../task/followState';

/** Narrow My Tasks to only the tasks the given user follows. When `on` is false
 * (or there's no signed-in email), returns the list unchanged. Pure + total.
 * Used before bucketing so every group + count reflects the filter. */
export function filterFollowing(
  tasks: TaskRecord[],
  email: string | null,
  on: boolean,
): TaskRecord[] {
  if (!on || !email) return tasks;
  return tasks.filter((t) => isFollowing(t.followers, email));
}
