import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from './taskMeta';

export interface SubProgress {
  done: number;
  total: number;
}

/** Subtask completion per parent task, computed from the full task set the
 * board already holds (a subtask has parentTaskId set). Parents with no
 * subtasks are absent. Pure so the card chips are deterministic. */
export function subtaskProgressByParent(tasks: TaskRecord[]): Map<string, SubProgress> {
  const map = new Map<string, SubProgress>();
  for (const task of tasks) {
    if (!task.parentTaskId) continue;
    const p = map.get(task.parentTaskId) ?? { done: 0, total: 0 };
    p.total += 1;
    if (isDone(task)) p.done += 1;
    map.set(task.parentTaskId, p);
  }
  return map;
}
