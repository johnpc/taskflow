import { useTheme } from './useTheme';
import type { ThemePref } from './themeStore';

const OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/** Light / Dark / System segmented control. Persists the choice and applies it
 * to <html> via useTheme, so it survives reloads and overrides the OS setting. */
export function ThemeToggle() {
  const { pref, choose } = useTheme();
  return (
    <div className="settings__theme" role="group" aria-label="Theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-testid={`theme-${opt.value}`}
          className={pref === opt.value ? 'settings__seg settings__seg--on' : 'settings__seg'}
          aria-pressed={pref === opt.value}
          onClick={() => choose(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
