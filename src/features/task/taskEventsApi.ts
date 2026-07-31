/**
 * Task activity-log events — created / completed / reopened. Thin I/O over the
 * Amplify client: log an event (best-effort — never blocks the mutation it
 * annotates) and list a task's events oldest-first.
 */
import { dataClient } from '../../lib/dataClient';
import { currentEmail } from '../auth/authClient';
import { membersForTask } from '../auth/members';

export type TaskEventKind = 'CREATED' | 'COMPLETED' | 'REOPENED';

export interface TaskEventRecord {
  id: string;
  kind: TaskEventKind;
  actorEmail: string | null;
  createdAt: string;
}

/** Append an activity event to a task. Best-effort: a failure here must not fail
 * the task mutation it records, so callers swallow errors. */
export async function logTaskEvent(taskId: string, kind: TaskEventKind): Promise<void> {
  await dataClient.models.TaskEvent.create({
    taskId,
    kind,
    actorEmail: (await currentEmail()) ?? undefined,
    members: await membersForTask(taskId),
  });
}

/** List a task's activity events, oldest first. */
export async function fetchTaskEvents(taskId: string): Promise<TaskEventRecord[]> {
  const { data } = await dataClient.models.TaskEvent.listTaskEventByTaskId(
    { taskId },
    { limit: 200 },
  );
  return (data ?? [])
    .filter(Boolean)
    .map((e) => ({
      id: e!.id,
      kind: e!.kind as TaskEventKind,
      actorEmail: e!.actorEmail ?? null,
      createdAt: e!.createdAt,
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
