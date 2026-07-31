import { IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { hasLiked, likeCount } from './taskLikes';

/** A heart toggle + like count for a task (Asana-style). Filled when the current
 * user has liked it; the number is the total like count (hidden when zero).
 * Presentational — the parent persists the toggled `likedBy` list. */
export function LikeButton({
  likedBy,
  currentEmail,
  onToggle,
}: {
  likedBy: (string | null)[] | null | undefined;
  currentEmail: string | null;
  onToggle: () => void;
}) {
  const liked = currentEmail ? hasLiked(likedBy, currentEmail) : false;
  const count = likeCount(likedBy);
  return (
    <button
      type="button"
      className={liked ? 'task-like task-like--on' : 'task-like'}
      data-testid="task-like"
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this task' : 'Like this task'}
      disabled={!currentEmail}
      onClick={onToggle}
    >
      <IonIcon icon={liked ? heart : heartOutline} aria-hidden="true" />
      {count > 0 && (
        <span className="task-like__count" data-testid="task-like-count">
          {count}
        </span>
      )}
    </button>
  );
}
