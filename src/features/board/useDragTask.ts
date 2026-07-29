import { useCallback, useState } from 'react';

/** Tracks the task id currently being dragged across the board. A column's drop
 * handler reads it to know what was dropped. Framework-only state so the drag
 * interaction stays out of the pure drop math (computeDrop). */
export function useDragTask() {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const start = useCallback((id: string) => setDraggingId(id), []);
  const end = useCallback(() => setDraggingId(null), []);
  return { draggingId, start, end };
}
