import { useState } from 'react';
import { relativeTime } from './relativeTime';
import { CommentBody } from './CommentBody';
import { CommentEditor } from './CommentEditor';
import { hasLiked, likeCount } from './taskLikes';
import type { CommentRecord } from '../../lib/dataClient';

/** One comment: author + relative timestamp + body, with Like/Edit/Delete
 * controls. Edit swaps to an inline editor (CommentEditor); like toggles the
 * current user's heart. All mutations are delegated up; only the editing flag
 * lives here. `nowMs` is injected for deterministic timestamps. */
export function CommentRow({
  comment,
  nowMs,
  currentEmail,
  onEdit,
  onDelete,
  onLike,
}: {
  comment: CommentRecord;
  nowMs: number;
  currentEmail: string | null;
  onEdit: (input: { id: string; body: string }) => void;
  onDelete: (id: string) => void;
  onLike: (comment: CommentRecord) => void;
}) {
  const [editing, setEditing] = useState(false);
  const when = relativeTime(comment.createdAt, nowMs);
  const liked = currentEmail ? hasLiked(comment.likedBy, currentEmail) : false;
  const likes = likeCount(comment.likedBy);

  return (
    <li className="comment" data-testid="comment">
      <span className="comment__meta">
        <span className="comment__author">{comment.authorEmail ?? 'You'}</span>
        {when && (
          <span className="comment__time" data-testid="comment-time">
            {when}
          </span>
        )}
      </span>
      {editing ? (
        <CommentEditor
          body={comment.body}
          onSave={(body) => {
            onEdit({ id: comment.id, body });
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <CommentBody body={comment.body} />
          <div className="comment__actions">
            <button
              type="button"
              className={liked ? 'comment__like comment__like--on' : 'comment__like'}
              data-testid="comment-like"
              aria-pressed={liked}
              aria-label={liked ? 'Unlike comment' : 'Like comment'}
              disabled={!currentEmail}
              onClick={() => onLike(comment)}
            >
              ♥{likes > 0 && <span data-testid="comment-like-count"> {likes}</span>}
            </button>
            <button
              type="button"
              className="comment__edit"
              data-testid="comment-edit"
              aria-label="Edit comment"
              onClick={() => setEditing(true)}
            >
              ✎
            </button>
            <button
              type="button"
              className="comment__delete"
              data-testid="comment-delete"
              aria-label="Delete comment"
              onClick={() => onDelete(comment.id)}
            >
              ✕
            </button>
          </div>
        </>
      )}
    </li>
  );
}
