/** Persisted theme preference (Light / Dark / System) applied via a data-theme
 * attribute on <html>, which the token media query in variables.css keys off.
 * Pure/DOM helpers so the hook stays thin and this is unit-testable. */

export type ThemePref = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'tf-theme';

/** Read the stored preference, defaulting to 'system' (follow the OS). */
export function readThemePref(): ThemePref {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    /* storage unavailable — fall through to default */
  }
  return 'system';
}

/** Persist the preference (best-effort — storage may be unavailable). */
export function writeThemePref(pref: ThemePref): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

/** Apply a preference to the document root. 'system' removes the explicit
 * override so `prefers-color-scheme` takes over; light/dark force it. */
export function applyThemePref(pref: ThemePref, root: HTMLElement): void {
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
}
