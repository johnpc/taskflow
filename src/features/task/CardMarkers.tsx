import { repeats, REPEAT_META, type Repeat } from './recurrence';
import { likeCount } from './taskLikes';
import type { TaskRecord } from '../../lib/dataClient';

/** The small count/badge markers on a card meta row: subtask progress, repeat
 * cadence, and like count. Each renders only when relevant. Split from CardMeta
 * to keep that composer within the line limit. */
export function CardMarkers({
  task,
  subtasks,
}: {
  task: TaskRecord;
  subtasks?: { done: number; total: number };
}) {
  const likes = likeCount(task.likedBy);
  return (
    <>
      {subtasks && subtasks.total > 0 && (
        <span className="task-card__subs" data-testid="task-subs" aria-label="Subtasks done">
          ◑ {subtasks.done}/{subtasks.total}
        </span>
      )}
      {repeats(task.repeat as Repeat) && (
        <span className="task-card__repeat" data-testid="task-repeat-badge" aria-label="Repeats">
          ↻ {REPEAT_META[task.repeat as Repeat]}
        </span>
      )}
      {likes > 0 && (
        <span className="task-card__likes" data-testid="task-likes" aria-label={`${likes} likes`}>
          ♥ {likes}
        </span>
      )}
    </>
  );
}
