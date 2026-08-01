import { LikeButton } from './LikeButton';
import { TaskFollowers } from './TaskFollowers';
import { toggleLike } from './taskLikes';
import type { TaskRecord } from '../../lib/dataClient';

/** The task-detail social row: the like (heart) toggle + the followers toggle
 * and avatar stack. Split from TaskDetailBody so that composer stays under the
 * line limit; both delegate their toggled array up via onPatch. */
export function TaskSocial({
  task,
  currentEmail,
  onPatch,
}: {
  task: TaskRecord;
  currentEmail: string | null;
  onPatch: (patch: Partial<TaskRecord>) => void;
}) {
  return (
    <>
      <LikeButton
        likedBy={task.likedBy}
        currentEmail={currentEmail}
        onToggle={() =>
          currentEmail && onPatch({ likedBy: toggleLike(task.likedBy, currentEmail) })
        }
      />
      <TaskFollowers
        task={task}
        currentEmail={currentEmail}
        onChange={(followers) => onPatch({ followers })}
      />
    </>
  );
}
