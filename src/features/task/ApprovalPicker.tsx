import { APPROVAL_OPTIONS, approvalOf, type Approval } from './approval';
import type { TaskRecord } from '../../lib/dataClient';

/** The approval-outcome selector on task detail (Asana approvals): mark a task
 * Approved / Changes requested / Rejected, or No approval. Delegates the change
 * up; presentational. */
export function ApprovalPicker({
  task,
  onChange,
}: {
  task: TaskRecord;
  onChange: (approval: Approval) => void;
}) {
  return (
    <div className="task-fields__row">
      <span className="task-fields__label">Approval</span>
      <select
        className="task-fields__select"
        data-testid="task-approval"
        aria-label="Approval status"
        value={approvalOf(task.approval)}
        onChange={(e) => onChange(e.target.value as Approval)}
      >
        {APPROVAL_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
