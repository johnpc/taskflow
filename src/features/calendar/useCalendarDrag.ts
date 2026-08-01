import { useState } from 'react';

type RescheduleFn = (patch: { id: string; dueDate: string }) => void;

/** Drag wiring for the month grid: track the task chip being dragged, and on
 * drop over a day cell set that task's due date to the cell's date. Keeps the
 * DnD state out of the pure grid + cells. No-op when the chip is dropped back on
 * its own day. */
export function useCalendarDrag(onReschedule?: RescheduleFn) {
  const [dragging, setDragging] = useState<{ id: string; from: string } | null>(null);
  return {
    draggingId: dragging?.id ?? null,
    onStart: (id: string, from: string) => setDragging({ id, from }),
    onEnd: () => setDragging(null),
    onDropOnDay: (date: string) => {
      if (dragging && dragging.from !== date) onReschedule?.({ id: dragging.id, dueDate: date });
      setDragging(null);
    },
  };
}
