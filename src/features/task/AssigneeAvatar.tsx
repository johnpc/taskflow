import { useProfileDisplay } from '../profile/useProfileDisplay';

/** A small round avatar showing an assignee's initials, on cards + rows so you
 * can see at a glance who owns a task. Resolves the assignee's display name (if
 * they set one) for the initials + label, falling back to their email. Renders
 * nothing when unassigned. */
export function AssigneeAvatar({ email }: { email: string | null | undefined }) {
  const { label, initials } = useProfileDisplay(email);
  if (!email || !initials) return null;
  return (
    <span
      className="task-card__avatar"
      data-testid="task-assignee-avatar"
      title={label}
      aria-label={`Assigned to ${label}`}
    >
      {initials}
    </span>
  );
}
