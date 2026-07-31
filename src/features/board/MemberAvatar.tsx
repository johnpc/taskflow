import { useProfileDisplay } from '../profile/useProfileDisplay';

/** One member avatar in the header presence stack: the member's initials
 * (resolved from their display name if set, else their email), with the full
 * label as the tooltip. Self-fetches (react-query dedupes per email). */
export function MemberAvatar({ email }: { email: string }) {
  const { label, initials } = useProfileDisplay(email);
  return (
    <span className="member-avatars__item" data-testid="member-avatar" title={label}>
      {initials}
    </span>
  );
}
