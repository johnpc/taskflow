import { MemberAvatar } from './MemberAvatar';
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
        <MemberAvatar key={email} email={email} />
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
