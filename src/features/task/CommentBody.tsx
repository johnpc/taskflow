import { parseMentions } from './mentions';

/** Renders a comment body with @mentions highlighted. Plain text otherwise;
 * pure presentational (parsing lives in parseMentions). */
export function CommentBody({ body }: { body: string }) {
  const segments = parseMentions(body);
  return (
    <span className="comment__body" data-testid="comment-body">
      {segments.map((seg, i) =>
        seg.mention ? (
          <span key={i} className="comment__mention" data-testid="comment-mention">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
