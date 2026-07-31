import { useState } from 'react';

/** Inline edit mode for a comment: a textarea seeded from the current body with
 * Save/Cancel. Commits via onSave only when the trimmed body actually changed;
 * Cancel discards. Split from CommentRow to keep it within the line limit. */
export function CommentEditor({
  body,
  onSave,
  onCancel,
}: {
  body: string;
  onSave: (body: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(body);
  const save = () => {
    const next = draft.trim();
    if (next && next !== body) onSave(next);
    else onCancel();
  };
  return (
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
        <button type="button" data-testid="comment-edit-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
