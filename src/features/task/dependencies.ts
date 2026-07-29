import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from './taskMeta';

/** Clean a possibly-nullable id array into a string[] (drops nulls). */
export function cleanIds(ids: (string | null)[] | null | undefined): string[] {
  return (ids ?? []).filter((x): x is string => !!x);
}

/** Add or remove a blocker id, returning the new list (pure, order-stable). */
export function toggleBlockerId(
  current: (string | null)[] | null | undefined,
  id: string,
): string[] {
  const ids = cleanIds(current);
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

/** Resolve a task's blocker ids to the records that still exist, in list order. */
export function blockerTasks(task: TaskRecord, all: TaskRecord[]): TaskRecord[] {
  const byId = new Map(all.map((t) => [t.id, t]));
  return cleanIds(task.blockedByIds)
    .map((id) => byId.get(id))
    .filter((t): t is TaskRecord => !!t);
}

/** The tasks this one blocks: every other task that lists it as a blocker. The
 * inverse of blockerTasks, derived from the same project set (no extra fetch). */
export function dependentTasks(task: TaskRecord, all: TaskRecord[]): TaskRecord[] {
  return all.filter((t) => t.id !== task.id && cleanIds(t.blockedByIds).includes(task.id));
}

/** A task is blocked when at least one of its blockers is not yet done. A
 * blocker id pointing at a deleted/missing task is treated as cleared. */
export function isBlocked(task: TaskRecord, all: TaskRecord[]): boolean {
  return blockerTasks(task, all).some((b) => !isDone(b));
}

/** Candidate blockers for a task: same-project tasks, excluding the task itself
 * and its own subtasks (a parent can't be blocked by its child). */
export function blockerCandidates(task: TaskRecord, all: TaskRecord[]): TaskRecord[] {
  return all.filter((t) => t.id !== task.id && t.parentTaskId !== task.id);
}

/** Ids of every task that is currently blocked, given the full task set. Lets
 * the board flag "Blocked" cards from data it already holds (no extra fetch). */
export function blockedIdSet(all: TaskRecord[]): Set<string> {
  return new Set(all.filter((t) => isBlocked(t, all)).map((t) => t.id));
}
