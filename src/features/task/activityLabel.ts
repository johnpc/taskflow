import type { TaskEventKind } from './taskEventsApi';

const VERB: Record<TaskEventKind, string> = {
  CREATED: 'created this task',
  COMPLETED: 'completed this task',
  REOPENED: 'reopened this task',
};

/** A human line for an activity event: "<who> <did what>". Falls back to
 * "Someone" for an unknown actor. Pure. */
export function activityLabel(kind: TaskEventKind, actorEmail: string | null): string {
  return `${actorEmail || 'Someone'} ${VERB[kind]}`;
}
