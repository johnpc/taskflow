/**
 * My Tasks server state — every open task the owner has, across all projects.
 * Owner-scoped models mean a plain Task.list already returns only this user's
 * rows; the due-bucket grouping lives in the pure groupByDue helper.
 */
import { dataClient, type TaskRecord } from '../../lib/dataClient';

/** All of the owner's tasks (bounded page), for the My Tasks aggregation. */
export async function fetchMyTasks(): Promise<TaskRecord[]> {
  const { data } = await dataClient.models.Task.list({ limit: 1000 });
  // Top-level tasks only — subtasks are managed inside their parent.
  return (data ?? []).filter((t) => !!t && !t.parentTaskId) as TaskRecord[];
}
