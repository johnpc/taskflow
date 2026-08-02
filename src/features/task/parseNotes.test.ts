import { describe, it, expect } from 'vitest';
import { parseNotes, parseInline, hasRichNotes } from './parseNotes';

describe('hasRichNotes', () => {
  it('is false for empty or plain prose', () => {
    expect(hasRichNotes(null)).toBe(false);
    expect(hasRichNotes('')).toBe(false);
    expect(hasRichNotes('Blog post + email + social.')).toBe(false);
    expect(hasRichNotes('line one\nline two')).toBe(false);
  });
  it('is true for bold, a safe link, or a checklist', () => {
    expect(hasRichNotes('some **bold** text')).toBe(true);
    expect(hasRichNotes('see [docs](https://example.com)')).toBe(true);
    expect(hasRichNotes('[ ] todo item')).toBe(true);
  });
  it('treats an unsafe link as plain (no preview)', () => {
    // safeHref rejects it → the inline degrades to plain text, so not "rich".
    expect(hasRichNotes('click [here](javascript:alert(1)) now')).toBe(false);
  });
});

describe('parseInline', () => {
  it('splits bold and text', () => {
    expect(parseInline('a **b** c')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'bold', text: 'b' },
      { kind: 'text', text: ' c' },
    ]);
  });

  it('renders safe links and degrades unsafe ones to text', () => {
    expect(parseInline('see [site](https://x.io)')).toContainEqual({
      kind: 'link',
      text: 'site',
      href: 'https://x.io',
    });
    // javascript: link is NOT turned into an anchor.
    const unsafe = parseInline('[x](javascript:alert(1))');
    expect(unsafe.every((s) => s.kind !== 'link')).toBe(true);
  });
});

describe('parseNotes', () => {
  it('returns [] for empty', () => {
    expect(parseNotes(null)).toEqual([]);
    expect(parseNotes('')).toEqual([]);
  });

  it('detects checklist lines and their checked state', () => {
    const lines = parseNotes('[ ] todo\n[x] done\nplain');
    expect(lines[0]).toMatchObject({ kind: 'check', checked: false });
    expect(lines[1]).toMatchObject({ kind: 'check', checked: true });
    expect(lines[2].kind).toBe('text');
  });
});
