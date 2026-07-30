import { assigneeInitials } from './assigneeInitials';

/** A small round avatar showing an assignee's initials, on cards + rows so you
 * can see at a glance who owns a task. Renders nothing when unassigned. The full
 * email is the title/aria-label for accessibility. */
export function AssigneeAvatar({ email }: { email: string | null | undefined }) {
  const initials = assigneeInitials(email);
  if (!initials) return null;
  return (
    <span
      className="task-card__avatar"
      data-testid="task-assignee-avatar"
      title={email ?? undefined}
      aria-label={`Assigned to ${email}`}
    >
      {initials}
    </span>
  );
}
