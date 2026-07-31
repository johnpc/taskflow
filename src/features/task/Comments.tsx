import { useState } from 'react';
import { CommentRow } from './CommentRow';
import type { CommentRecord } from '../../lib/dataClient';

/** Comment thread on task detail: the existing comments (oldest first, each
 * editable/deletable via CommentRow) plus a composer. Delegates all mutations
 * to the parent; local state only for the new-comment draft. */
export function Comments({
  comments,
  busy,
  nowMs,
  currentEmail,
  onPost,
  onEdit,
  onDelete,
  onLike,
}: {
  comments: CommentRecord[];
  busy: boolean;
  nowMs: number;
  currentEmail: string | null;
  onPost: (body: string) => void;
  onEdit: (input: { id: string; body: string }) => void;
  onDelete: (id: string) => void;
  onLike: (comment: CommentRecord) => void;
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
          <CommentRow
            key={c.id}
            comment={c}
            nowMs={nowMs}
            currentEmail={currentEmail}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
          />
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
