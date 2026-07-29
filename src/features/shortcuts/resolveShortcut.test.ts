import { describe, it, expect } from 'vitest';
import { resolveShortcut } from './resolveShortcut';

describe('resolveShortcut', () => {
  it('enters leader mode on g', () => {
    expect(resolveShortcut('g', false)).toEqual({ action: { kind: 'leader' }, leaderNext: true });
  });

  it('navigates on a leader combo', () => {
    expect(resolveShortcut('h', true)).toEqual({
      action: { kind: 'nav', to: '/home' },
      leaderNext: false,
    });
    expect(resolveShortcut('p', true).action).toEqual({ kind: 'nav', to: '/projects' });
    expect(resolveShortcut('t', true).action).toEqual({ kind: 'nav', to: '/my-tasks' });
    expect(resolveShortcut('c', true).action).toEqual({ kind: 'nav', to: '/calendar' });
  });

  it('clears leader on an unknown follow key', () => {
    expect(resolveShortcut('z', true)).toEqual({ action: null, leaderNext: false });
  });

  it('handles / and ?', () => {
    expect(resolveShortcut('/', false).action).toEqual({ kind: 'nav', to: '/search' });
    expect(resolveShortcut('?', false).action).toEqual({ kind: 'help' });
  });

  it('ignores modifier combos', () => {
    expect(resolveShortcut('p', false, { meta: true }).action).toBeNull();
    expect(resolveShortcut('h', true, { ctrl: true }).action).toBeNull();
  });
});
