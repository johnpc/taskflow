/** A segment of a comment body: plain text, or an @mention token. Pure parsing
 * so rendering + tests share one source of truth. */
export interface MentionSegment {
  text: string;
  mention: boolean;
}

// An @mention is @ followed by a name/handle: word chars, dots, hyphens (e.g.
// "@ada", "@ada.lovelace", "@grace-h"). Stops at whitespace/punctuation.
const MENTION = /(@[\w.-]+)/g;

/** Split a comment body into text + @mention segments (in order). A body with
 * no mentions yields a single text segment. Pure + total. */
export function parseMentions(body: string): MentionSegment[] {
  const parts = body.split(MENTION).filter((p) => p !== '');
  return parts.map((text) => ({ text, mention: text.startsWith('@') && text.length > 1 }));
}
