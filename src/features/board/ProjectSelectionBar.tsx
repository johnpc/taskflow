import { SelectionBar } from './SelectionBar';
import type { useBulkSelection } from './useBulkSelection';
import type { SectionRecord } from '../../lib/dataClient';

/** Wires the board's bulk-selection handlers into the SelectionBar, rendering it
 * only when a selection is active. Split from ProjectView so that screen shell
 * stays within the line limit. */
export function ProjectSelectionBar({
  bulk,
  sections,
  members,
}: {
  bulk: ReturnType<typeof useBulkSelection>;
  sections: SectionRecord[];
  members: string[];
}) {
  if (!bulk.selection.active) return null;
  return (
    <SelectionBar
      count={bulk.selection.count}
      sections={sections}
      members={members}
      onComplete={bulk.completeSelected}
      onMove={bulk.moveSelected}
      onAssign={bulk.assignSelected}
      onPriority={bulk.prioritizeSelected}
      onDelete={bulk.deleteSelected}
      onClear={bulk.selection.clear}
    />
  );
}
