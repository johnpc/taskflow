import { LabelPicker } from '../labels/LabelPicker';
import { toggleLabelId } from '../labels/resolveLabels';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** Task-detail labels section: renders the label picker over the owner's label
 * registry, toggling a label patches the task's labelIds, and a new label is
 * created then applied. Thin wiring over LabelPicker + the task patch. */
export function TaskLabels({
  task,
  registry,
  onPatchLabels,
  onCreateLabel,
}: {
  task: TaskRecord;
  registry: LabelRecord[];
  onPatchLabels: (labelIds: string[]) => void;
  onCreateLabel: (input: { name: string; color: string }) => void;
}) {
  const selected = new Set((task.labelIds ?? []).filter((x): x is string => !!x));
  return (
    <section className="task-labels" data-testid="task-labels">
      <h2 className="subtasks__head">Labels</h2>
      <LabelPicker
        registry={registry}
        selectedIds={selected}
        onToggle={(labelId) => onPatchLabels(toggleLabelId(task.labelIds, labelId))}
        onCreate={onCreateLabel}
      />
    </section>
  );
}
