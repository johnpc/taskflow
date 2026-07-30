import { assigneeInitials } from '../task/assigneeInitials';
import './board.css';

/** An overlapping stack of member initials-avatars for the project header — an
 * at-a-glance "who's on this project" (Asana's top-right presence stack). Shows
 * up to `max` avatars, then a "+N" more chip. Renders nothing for a solo (or
 * empty) project since a lone owner-avatar adds no information. */
export function MemberAvatars({ members, max = 4 }: { members: string[]; max?: number }) {
  if (members.length <= 1) return null;
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <span
      className="member-avatars"
      data-testid="member-avatars"
      aria-label={`${members.length} members`}
    >
      {shown.map((email) => (
        <span
          key={email}
          className="member-avatars__item"
          data-testid="member-avatar"
          title={email}
        >
          {assigneeInitials(email)}
        </span>
      ))}
      {extra > 0 && (
        <span
          className="member-avatars__item member-avatars__more"
          data-testid="member-avatar-more"
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
