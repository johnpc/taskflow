import type { TaskRecord } from '../../lib/dataClient';

export interface OrderUpdate {
  id: string;
  sortOrder: number;
}

/** Compute the sortOrder swaps to move a task one step up or down within its
 * (already-ordered) column. Returns the two rows whose sortOrder must change,
 * or [] when the move is a no-op (task not found, or already at the edge).
 * Pure + total so reordering is deterministic + testable. */
export function reorderTasks(
  tasks: TaskRecord[],
  taskId: string,
  direction: 'up' | 'down',
): OrderUpdate[] {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return [];
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= tasks.length) return [];
  const a = tasks[index];
  const b = tasks[swapWith];
  return [
    { id: a.id, sortOrder: b.sortOrder ?? swapWith },
    { id: b.id, sortOrder: a.sortOrder ?? index },
  ];
}
