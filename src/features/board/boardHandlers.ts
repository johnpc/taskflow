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
  patch: {
    dueDate?: string | null;
    priority?: Priority;
    title?: string;
    assigneeEmail?: string | null;
  },
) => void;

/** Drag-and-drop wiring for the board: begin/end a card drag, drop it onto a
 * section (move-to-section, appended), or drop it onto a card (insert at that
 * card's position). Bundled so columns/cards take one prop, not several. */
export interface BoardDrag {
  draggingId: string | null;
  onStart: (taskId: string) => void;
  onEnd: () => void;
  onDropToSection: (sectionId: string) => void;
  onDropToTask: (targetTaskId: string) => void;
}
