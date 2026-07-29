import type { Column } from './taskGrouping';

export interface DropPatch {
  id: string;
  sectionId: string;
  sortOrder: number;
}

/** Resolve dropping task `taskId` onto section `targetSectionId`: move it to that
 * section, appended after the section's current highest sortOrder. Returns null
 * when the task is already in that section (a no-op) or isn't found. Pure so the
 * drag interaction is deterministic + testable. */
export function computeDrop(
  columns: Column[],
  taskId: string,
  targetSectionId: string,
): DropPatch | null {
  const from = columns.find((c) => c.tasks.some((t) => t.id === taskId));
  if (!from || from.section.id === targetSectionId) return null;
  const target = columns.find((c) => c.section.id === targetSectionId);
  if (!target) return null;
  const nextOrder = target.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
  return { id: taskId, sectionId: targetSectionId, sortOrder: nextOrder };
}
