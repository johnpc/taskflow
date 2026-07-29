import { isDone } from './taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** The warning to confirm before completing a task early, or null if it can be
 * completed cleanly. A task with unfinished dependencies takes precedence over
 * one with incomplete subtasks (the harder blocker to miss). Pure — the caller
 * supplies the already-loaded blocked flag + subtask list. */
export function completeWarning(blocked: boolean, subtasks: TaskRecord[]): string | null {
  if (blocked) return 'It has unfinished dependencies. Complete it anyway?';
  const openSubs = subtasks.filter((s) => !isDone(s)).length;
  if (openSubs > 0) {
    const s = openSubs === 1 ? '' : 's';
    return `It still has ${openSubs} incomplete subtask${s}. Complete it anyway?`;
  }
  return null;
}
