import { AssigneeAvatar } from './AssigneeAvatar';

/** A subtask's assignee on the checklist: the name-resolved avatar when
 * assigned. When `onAssign` + `members` are given it's editable — a transparent
 * `<select>` overlays the avatar (or a "+" affordance when unassigned) so you can
 * (re)assign inline without opening the subtask. Read-only otherwise. */
export function SubtaskAssignee({
  assigneeEmail,
  members,
  onAssign,
}: {
  assigneeEmail: string | null | undefined;
  members?: string[];
  onAssign?: (email: string | null) => void;
}) {
  if (!onAssign || !members) return <AssigneeAvatar email={assigneeEmail} />;
  const value = assigneeEmail ?? '';
  const options = value && !members.includes(value) ? [value, ...members] : members;
  return (
    <label className="subtask__assignee-edit" data-testid="subtask-assignee-edit">
      {assigneeEmail ? (
        <AssigneeAvatar email={assigneeEmail} />
      ) : (
        <span className="subtask__assignee-add" aria-hidden="true">
          +
        </span>
      )}
      <select
        className="subtask__assignee-input"
        aria-label="Assign subtask"
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onAssign(e.target.value || null)}
      >
        <option value="">Unassigned</option>
        {options.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </label>
  );
}
