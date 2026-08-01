import { MemberAvatar } from '../board/MemberAvatar';
import { isFollowing, followerCount, toggleFollow } from './followState';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail followers row (Asana): a Follow/Following toggle for the current
 * user plus an avatar stack of everyone following. Delegates the toggled list
 * up; presentational. */
export function TaskFollowers({
  task,
  currentEmail,
  onChange,
}: {
  task: TaskRecord;
  currentEmail: string | null;
  onChange: (followers: string[]) => void;
}) {
  const followers = (task.followers ?? []).filter((f): f is string => !!f);
  const following = currentEmail ? isFollowing(followers, currentEmail) : false;
  const count = followerCount(followers);
  return (
    <div className="task-fields__row task-followers">
      <span className="task-fields__label">Followers</span>
      <span className="task-followers__body">
        <button
          type="button"
          className={following ? 'task-follow task-follow--on' : 'task-follow'}
          data-testid="task-follow"
          aria-pressed={following}
          disabled={!currentEmail}
          onClick={() => currentEmail && onChange(toggleFollow(followers, currentEmail))}
        >
          {following ? 'Following' : 'Follow'}
        </button>
        {count > 0 && (
          <span className="task-followers__stack" data-testid="task-followers">
            {followers.map((email) => (
              <MemberAvatar key={email} email={email} />
            ))}
          </span>
        )}
      </span>
    </div>
  );
}
