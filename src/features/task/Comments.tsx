import { useState } from 'react';
import type { CommentRecord } from '../../lib/dataClient';

/** Comment thread on task detail: the existing comments (oldest first) plus a
 * composer. Delegates posting to the parent; local state only for the draft. */
export function Comments({
  comments,
  busy,
  onPost,
  onDelete,
}: {
  comments: CommentRecord[];
  busy: boolean;
  onPost: (body: string) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    onPost(body);
    setDraft('');
  };

  return (
    <section className="comments" data-testid="comments">
      <h2 className="comments__head">Comments</h2>
      <ul className="comments__list">
        {comments.map((c) => (
          <li key={c.id} className="comment" data-testid="comment">
            <span className="comment__author">{c.authorEmail ?? 'You'}</span>
            <span className="comment__body">{c.body}</span>
            <button
              type="button"
              className="comment__delete"
              data-testid="comment-delete"
              aria-label="Delete comment"
              onClick={() => onDelete(c.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="comments__composer">
        <textarea
          className="comments__input"
          data-testid="comment-input"
          placeholder="Write a comment…"
          rows={2}
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="button"
          className="comments__post"
          data-testid="comment-post"
          disabled={busy || !draft.trim()}
          onClick={submit}
        >
          Comment
        </button>
      </div>
    </section>
  );
}
