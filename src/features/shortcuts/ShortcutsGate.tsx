import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { ShortcutsHelp } from './ShortcutsHelp';

/** Mounts the global keyboard-shortcut listener and renders the help overlay
 * when toggled. Placed inside the router so nav shortcuts work; renders nothing
 * visible until `?` is pressed. */
export function ShortcutsGate() {
  const { helpOpen, closeHelp } = useKeyboardShortcuts();
  return helpOpen ? <ShortcutsHelp onClose={closeHelp} /> : null;
}
