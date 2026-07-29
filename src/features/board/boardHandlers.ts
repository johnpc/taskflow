import type { Priority } from '../task/taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Shared handler signatures threaded from ProjectView through BoardContent into
 * columns/sections and their task cards. Kept in one place so the board tree's
 * prop types stay consistent. */
export type AddTaskFn = (input: { sectionId: string; title: string; order: number }) => void;
export type ToggleDoneFn = (input: { id: string; done: boolean; now: string }) => void;
export type ReorderFn = (input: {
  columnTasks: TaskRecord[];
  taskId: string;
  direction: 'up' | 'down';
}) => void;
export type QuickEditFn = (
  taskId: string,
  patch: { dueDate?: string | null; priority?: Priority; title?: string },
) => void;
