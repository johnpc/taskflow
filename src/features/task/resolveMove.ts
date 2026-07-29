import type { SectionRecord } from '../../lib/dataClient';

/** The patch to move a task into `projectId`, landing it in that project's
 * first section (by sortOrder) and clearing blockedByIds — cross-project
 * dependencies don't apply. Returns null when the target has no sections yet
 * (the caller should ensure defaults first). Pure so the move is testable. */
export function resolveMove(taskId: string, projectId: string, targetSections: SectionRecord[]) {
  const first = [...targetSections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  if (!first) return null;
  return { id: taskId, projectId, sectionId: first.id, blockedByIds: [] as string[] };
}
