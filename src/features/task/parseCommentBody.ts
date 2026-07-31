import { parseInline, type Inline } from './parseNotes';

/** A rendered comment span: the notes inline kinds (text/bold/link) plus an
 * @mention token. */
export type CommentSpan = Inline | { kind: 'mention'; text: string };

// An @mention is @ followed by word chars / dots / hyphens (e.g. "@ada",
// "@ada.lovelace", "@grace-h"). A bare "@" is not a mention.
const MENTION = /(@[\w.-]+)/g;

/** Split a plain-text run into text + @mention spans (in order). */
function splitMentions(text: string): CommentSpan[] {
  return text
    .split(MENTION)
    .filter((p) => p !== '')
    .map((p) =>
      p.startsWith('@') && p.length > 1 ? { kind: 'mention', text: p } : { kind: 'text', text: p },
    );
}

/** Parse a comment body into rich spans: **bold**, safe [links](url), and
 * @mentions. Reuses the notes inline parser, then splits its plain-text spans
 * into mention tokens (bold/link spans are left intact). Pure + total. */
export function parseCommentBody(body: string): CommentSpan[] {
  return parseInline(body).flatMap((span) =>
    span.kind === 'text' ? splitMentions(span.text) : [span],
  );
}
