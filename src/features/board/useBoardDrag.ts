import { useDragTask } from './useDragTask';
import { computeDrop } from './computeDrop';
import { computeReorderDrop } from './computeReorderDrop';
import type { Column } from './taskGrouping';
import type { BoardDrag } from './boardHandlers';
import type { updateTask } from '../task/tasksApi';

type PatchFn = (patch: Parameters<typeof updateTask>[0]) => void;

/** Build the board's drag wiring: dropping a card on an empty section moves it
 * there (appended), dropping it on another card inserts it at that position
 * (same or cross section, resequenced). Both resolve via pure helpers and apply
 * through the board's quick-edit patch. Split from BoardRegion to keep it thin. */
export function useBoardDrag(columns: Column[], patch: PatchFn): BoardDrag {
  const drag = useDragTask();
  return {
    draggingId: drag.draggingId,
    onStart: drag.start,
    onEnd: drag.end,
    onDropToSection: (sectionId) => {
      const p = drag.draggingId && computeDrop(columns, drag.draggingId, sectionId);
      if (p) patch(p);
      drag.end();
    },
    onDropToTask: (targetTaskId) => {
      const patches = drag.draggingId
        ? computeReorderDrop(columns, drag.draggingId, targetTaskId)
        : [];
      patches.forEach(patch);
      drag.end();
    },
  };
}
