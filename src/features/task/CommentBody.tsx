import { parseCommentBody } from './parseCommentBody';

/** Renders a comment body with **bold**, safe [links](url), and @mention
 * highlighting (the same rich inline formatting as task notes). Pure
 * presentational — parsing lives in parseCommentBody. */
export function CommentBody({ body }: { body: string }) {
  const spans = parseCommentBody(body);
  return (
    <span className="comment__body" data-testid="comment-body">
      {spans.map((s, i) => {
        if (s.kind === 'mention')
          return (
            <span key={i} className="comment__mention" data-testid="comment-mention">
              {s.text}
            </span>
          );
        if (s.kind === 'bold') return <strong key={i}>{s.text}</strong>;
        if (s.kind === 'link')
          return (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.text}
            </a>
          );
        return <span key={i}>{s.text}</span>;
      })}
    </span>
  );
}
