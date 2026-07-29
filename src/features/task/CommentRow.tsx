import { useState } from 'react';
import type { CommentRecord } from '../../lib/dataClient';

/** One comment: author + body with Edit/Delete controls, toggling to an inline
 * editor (textarea + Save/Cancel) on Edit. Edit + delete are delegated up; only
 * the local draft + editing flag live here. */
export function CommentRow({
  comment,
  onEdit,
  onDelete,
}: {
  comment: CommentRecord;
  onEdit: (input: { id: string; body: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);

  const save = () => {
    const body = draft.trim();
    if (body && body !== comment.body) onEdit({ id: comment.id, body });
    setEditing(false);
  };

  return (
    <li className="comment" data-testid="comment">
      <span className="comment__author">{comment.authorEmail ?? 'You'}</span>
      {editing ? (
        <>
          <textarea
            className="comments__input"
            data-testid="comment-edit-input"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="comment__edit-actions">
            <button type="button" data-testid="comment-edit-save" onClick={save}>
              Save
            </button>
            <button
              type="button"
              data-testid="comment-edit-cancel"
              onClick={() => {
                setDraft(comment.body);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="comment__body">{comment.body}</span>
          <div className="comment__actions">
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
