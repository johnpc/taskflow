import { describe, it, expect } from 'vitest';
import { parseCommentBody } from './parseCommentBody';

describe('parseCommentBody', () => {
  it('highlights @mentions and keeps surrounding text', () => {
    expect(parseCommentBody('hey @ada look')).toEqual([
      { kind: 'text', text: 'hey ' },
      { kind: 'mention', text: '@ada' },
      { kind: 'text', text: ' look' },
    ]);
  });

  it('parses **bold** and safe [links](url) like notes', () => {
    const spans = parseCommentBody('see **this** and [docs](https://x.co)');
    expect(spans).toContainEqual({ kind: 'bold', text: 'this' });
    expect(spans).toContainEqual({ kind: 'link', text: 'docs', href: 'https://x.co' });
  });

  it('combines bold, link, and mention in one body', () => {
    const spans = parseCommentBody('**ping** @grace re [spec](https://x.co)');
    expect(spans.map((s) => s.kind)).toEqual(['bold', 'text', 'mention', 'text', 'link']);
  });

  it('degrades an unsafe link to plain text (via the notes parser)', () => {
    const spans = parseCommentBody('[x](javascript:alert(1))');
    expect(spans.every((s) => s.kind !== 'link')).toBe(true);
  });

  it('does not treat a bare @ as a mention', () => {
    expect(parseCommentBody('email @ work')).toEqual([{ kind: 'text', text: 'email @ work' }]);
  });
});
