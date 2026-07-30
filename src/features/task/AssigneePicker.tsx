/** Assignee dropdown: Unassigned + each project member (a shared project's
 * members can be assigned; a solo project just lists you). The current value is
 * the task's assigneeEmail. Presentational — the change is delegated up as a
 * patch. `members` come from the task's own member list. */
export function AssigneePicker({
  assigneeEmail,
  members,
  onAssign,
}: {
  assigneeEmail: string | null | undefined;
  members: string[];
  onAssign: (email: string | null) => void;
}) {
  const value = assigneeEmail ?? '';
  // An assignee no longer in members (e.g. removed) still shows so it's visible.
  const options = value && !members.includes(value) ? [value, ...members] : members;
  return (
    <select
      className="task-assign__select"
      data-testid="task-assignee-select"
      aria-label="Assignee"
      value={value}
      onChange={(e) => onAssign(e.target.value || null)}
    >
      <option value="">Unassigned</option>
      {options.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
