import { assigneeInitials } from './assigneeInitials';

/** A comment's author line: a small round initials avatar + the author label,
 * so the thread reads as a conversation (Asana/Slack-style) rather than a stack
 * of repeated raw emails. Falls back to "You" when the author email is absent.
 * Pure/presentational. */
export function CommentAuthor({ email }: { email: string | null | undefined }) {
  const label = email ?? 'You';
  const initials = assigneeInitials(email) || 'You'.slice(0, 1);
  return (
    <>
      <span className="comment__avatar" aria-hidden="true">
        {initials}
      </span>
      <span className="comment__author">{label}</span>
    </>
  );
}
