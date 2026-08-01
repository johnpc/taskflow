/** The My Tasks filter checkboxes: show-completed, assigned-to-me, and
 * following. A cohesive cluster split from MyTasks so that screen stays within
 * the line limit; each toggle is delegated up. */
export function MyTasksFilters({
  showCompleted,
  onShowCompleted,
  assignedOnly,
  onAssignedOnly,
  followingOnly,
  onFollowingOnly,
}: {
  showCompleted: boolean;
  onShowCompleted: (on: boolean) => void;
  assignedOnly: boolean;
  onAssignedOnly: (on: boolean) => void;
  followingOnly: boolean;
  onFollowingOnly: (on: boolean) => void;
}) {
  return (
    <div className="mytasks__filters">
      <label className="mytasks__show-done">
        <input
          type="checkbox"
          data-testid="mytasks-show-completed"
          checked={showCompleted}
          onChange={(e) => onShowCompleted(e.target.checked)}
        />
        Show completed
      </label>
      <label className="mytasks__show-done">
        <input
          type="checkbox"
          data-testid="mytasks-assigned-only"
          checked={assignedOnly}
          onChange={(e) => onAssignedOnly(e.target.checked)}
        />
        Assigned to me
      </label>
      <label className="mytasks__show-done">
        <input
          type="checkbox"
          data-testid="mytasks-following-only"
          checked={followingOnly}
          onChange={(e) => onFollowingOnly(e.target.checked)}
        />
        Following
      </label>
    </div>
  );
}
