import { dataClient } from '../../lib/dataClient';
import { isFollowing } from './followState';

/** Add `email` to a task's followers if not already following (read-modify-write
 * on the small followers array). No-op when already a follower or email is
 * blank. Its own module so both the comment path (taskDetailApi) and the assign
 * path (tasksApi) can use it without an import cycle. */
export async function ensureFollower(
  taskId: string,
  email: string | null | undefined,
): Promise<void> {
  if (!email) return;
  const { data: task } = await dataClient.models.Task.get({ id: taskId });
  if (!task || isFollowing(task.followers, email)) return;
  const followers = [...(task.followers ?? []).filter((f): f is string => !!f), email];
  await dataClient.models.Task.update({ id: taskId, followers });
}
