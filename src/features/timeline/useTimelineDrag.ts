import { useState } from 'react';
import { reschedulePatch } from './reschedule';
import type { TaskRecord } from '../../lib/dataClient';

type RescheduleFn = (patch: { id: string; dueDate: string; startDate?: string }) => void;

/** Drag wiring for the timeline: track the bar being dragged, and on drop over a
 * day column move that task's due date to that day (bar span preserved via
 * reschedulePatch, which shifts the start date by the same delta). Keeps the
 * DnD state out of the pure layout + view. */
export function useTimelineDrag(bars: { task: TaskRecord }[], onReschedule?: RescheduleFn) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  return {
    draggingId,
    onStart: (id: string) => setDraggingId(id),
    onEnd: () => setDraggingId(null),
    onDropOnDay: (date: string) => {
      const task = bars.find((b) => b.task.id === draggingId)?.task;
      const patch = task ? reschedulePatch(task, date) : null;
      if (patch) onReschedule?.(patch);
      setDraggingId(null);
    },
  };
}
