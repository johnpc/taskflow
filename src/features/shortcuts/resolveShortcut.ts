/** Global keyboard shortcuts. `g` is a leader key: press `g` then h/p/t/c to
 * navigate. `/` jumps to search, `?` toggles the help overlay. Pure resolver so
 * the key handling is testable without a DOM. */
export type ShortcutAction =
  | { kind: 'nav'; to: string }
  | { kind: 'help' }
  | { kind: 'leader' } // entered leader mode (`g`) — swallow, await next key
  | null;

const LEADER_NAV: Record<string, string> = {
  h: '/home',
  p: '/projects',
  t: '/my-tasks',
  c: '/calendar',
};

/** Resolve a keypress given whether we're mid-leader (`g` was just pressed).
 * Returns the action + the next leader state. Ignores modifier combos (let the
 * browser/OS have Cmd/Ctrl/Alt shortcuts). */
export function resolveShortcut(
  key: string,
  leaderActive: boolean,
  mods: { ctrl?: boolean; meta?: boolean; alt?: boolean } = {},
): { action: ShortcutAction; leaderNext: boolean } {
  if (mods.ctrl || mods.meta || mods.alt) return { action: null, leaderNext: false };
  if (leaderActive) {
    const to = LEADER_NAV[key.toLowerCase()];
    return { action: to ? { kind: 'nav', to } : null, leaderNext: false };
  }
  if (key === 'g') return { action: { kind: 'leader' }, leaderNext: true };
  if (key === '/') return { action: { kind: 'nav', to: '/search' }, leaderNext: false };
  if (key === '?') return { action: { kind: 'help' }, leaderNext: false };
  return { action: null, leaderNext: false };
}
