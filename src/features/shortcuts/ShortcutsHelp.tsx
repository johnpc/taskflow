import './shortcuts.css';

const ROWS: { keys: string; label: string }[] = [
  { keys: 'g h', label: 'Go to Home' },
  { keys: 'g p', label: 'Go to Projects' },
  { keys: 'g t', label: 'Go to My Tasks' },
  { keys: 'g c', label: 'Go to Calendar' },
  { keys: '/', label: 'Search' },
  { keys: '?', label: 'Toggle this help' },
];

/** The keyboard-shortcuts help overlay, toggled by `?`. Presentational; the open
 * state + dismiss come from the parent. */
export function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="shortcuts"
      role="dialog"
      aria-label="Keyboard shortcuts"
      data-testid="shortcuts-help"
    >
      <div className="shortcuts__card">
        <h2 className="tf-heading shortcuts__title">Keyboard shortcuts</h2>
        <ul className="shortcuts__list">
          {ROWS.map((r) => (
            <li key={r.keys} className="shortcuts__row">
              <kbd className="shortcuts__keys">{r.keys}</kbd>
              <span>{r.label}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="shortcuts__close"
          data-testid="shortcuts-close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
