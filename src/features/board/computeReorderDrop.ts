import type { Column } from './taskGrouping';
import type { TaskRecord } from '../../lib/dataClient';

export interface ReorderPatch {
  id: string;
  sectionId: string;
  sortOrder: number;
}

/** Resolve dropping task `taskId` ONTO card `targetTaskId`: the dragged task is
 * inserted at the target's position within the target's section (same or cross
 * section), and the affected section(s) are resequenced to dense 0..n
 * sortOrders. Returns only the rows whose sectionId or sortOrder actually
 * changed, or [] for a no-op (dropped on itself, or either card not found).
 * Pure + total so the drag interaction is deterministic + testable. */
export function computeReorderDrop(
  columns: Column[],
  taskId: string,
  targetTaskId: string,
): ReorderPatch[] {
  if (taskId === targetTaskId) return [];
  const from = columns.find((c) => c.tasks.some((t) => t.id === taskId));
  const to = columns.find((c) => c.tasks.some((t) => t.id === targetTaskId));
  if (!from || !to) return [];
  const dragged = from.tasks.find((t) => t.id === taskId)!;

  // Build the target section's new order: remove the dragged task if it's
  // already there, then insert it just before the target card.
  const base = to.tasks.filter((t) => t.id !== taskId);
  const at = base.findIndex((t) => t.id === targetTaskId);
  base.splice(at, 0, dragged);

  const patches: ReorderPatch[] = [];
  resequence(base, to.section.id, patches);
  // Cross-section: the source section also compacts (the dragged task left it).
  if (from.section.id !== to.section.id) {
    resequence(
      from.tasks.filter((t) => t.id !== taskId),
      from.section.id,
      patches,
    );
  }
  return patches;
}

/** Push a dense-index patch for each row whose sectionId or sortOrder changed. */
function resequence(tasks: TaskRecord[], sectionId: string, out: ReorderPatch[]): void {
  tasks.forEach((t, i) => {
    if (t.sortOrder !== i || t.sectionId !== sectionId) {
      out.push({ id: t.id, sectionId, sortOrder: i });
    }
  });
}
