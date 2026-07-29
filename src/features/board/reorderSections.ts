import type { SectionRecord } from '../../lib/dataClient';

export interface SectionOrderUpdate {
  id: string;
  sortOrder: number;
}

/** Compute the sortOrder swaps to move a section one step left or right within
 * its (ordered) project. Returns the two sections whose sortOrder must change,
 * or [] when the move is a no-op (not found / already at the edge). Pure. */
export function reorderSections(
  sections: SectionRecord[],
  sectionId: string,
  direction: 'left' | 'right',
): SectionOrderUpdate[] {
  const index = sections.findIndex((s) => s.id === sectionId);
  if (index === -1) return [];
  const swapWith = direction === 'left' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= sections.length) return [];
  const a = sections[index];
  const b = sections[swapWith];
  return [
    { id: a.id, sortOrder: b.sortOrder ?? swapWith },
    { id: b.id, sortOrder: a.sortOrder ?? index },
  ];
}
