import { SelectionBar } from './SelectionBar';
import type { useBulkSelection } from './useBulkSelection';
import type { LabelRecord, SectionRecord } from '../../lib/dataClient';

/** Wires the board's bulk-selection handlers into the SelectionBar, rendering it
 * only when a selection is active. Split from ProjectView so that screen shell
 * stays within the line limit. */
export function ProjectSelectionBar({
  bulk,
  sections,
  members,
  labels,
}: {
  bulk: ReturnType<typeof useBulkSelection>;
  sections: SectionRecord[];
  members: string[];
  labels: LabelRecord[];
}) {
  if (!bulk.selection.active) return null;
  return (
    <SelectionBar
      count={bulk.selection.count}
      sections={sections}
      members={members}
      labels={labels}
      onComplete={bulk.completeSelected}
      onMove={bulk.moveSelected}
      onAssign={bulk.assignSelected}
      onPriority={bulk.prioritizeSelected}
      onLabel={bulk.labelSelected}
      onUnlabel={bulk.unlabelSelected}
      onDelete={bulk.deleteSelected}
      onClear={bulk.selection.clear}
    />
  );
}
