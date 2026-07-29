/** My Tasks "Show completed" preference, persisted in localStorage. Pure
 * read/write helpers so the toggle stays testable and the hook thin. */

const KEY = 'tf-mytasks-show-completed';

/** Read the stored preference, defaulting to false (hidden). */
export function readShowCompleted(): boolean {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

/** Persist the chosen preference (best-effort). */
export function writeShowCompleted(show: boolean): void {
  try {
    localStorage.setItem(KEY, show ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}
