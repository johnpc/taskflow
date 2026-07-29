import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { resolveShortcut } from './resolveShortcut';

/** Whether the event target is a text-entry field — shortcuts must not fire
 * while the user is typing. */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/** Global keyboard shortcuts (see resolveShortcut). Navigates via the router and
 * exposes help-overlay open state. Mounted once in the app shell. */
export function useKeyboardShortcuts() {
  const history = useHistory();
  const [helpOpen, setHelpOpen] = useState(false);
  const leader = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const { action, leaderNext } = resolveShortcut(e.key, leader.current, {
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        alt: e.altKey,
      });
      leader.current = leaderNext;
      if (!action) return;
      if (action.kind === 'leader') return; // await the next key
      e.preventDefault();
      if (action.kind === 'nav') history.push(action.to);
      if (action.kind === 'help') setHelpOpen((v) => !v);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [history]);

  return { helpOpen, closeHelp: () => setHelpOpen(false) };
}
