import { describe, it, expect } from 'vitest';
import { parseMentions } from './mentions';

describe('parseMentions', () => {
  it('splits an @mention out of surrounding text', () => {
    expect(parseMentions('hey @ada can you look?')).toEqual([
      { text: 'hey ', mention: false },
      { text: '@ada', mention: true },
      { text: ' can you look?', mention: false },
    ]);
  });

  it('handles dotted/hyphenated handles and multiple mentions', () => {
    const segs = parseMentions('@ada.lovelace and @grace-h');
    expect(segs.filter((s) => s.mention).map((s) => s.text)).toEqual(['@ada.lovelace', '@grace-h']);
  });

  it('returns a single text segment when there are no mentions', () => {
    expect(parseMentions('just a note')).toEqual([{ text: 'just a note', mention: false }]);
  });

  it('does not treat a bare @ as a mention', () => {
    expect(parseMentions('email me @ work')).toEqual([{ text: 'email me @ work', mention: false }]);
  });
});
