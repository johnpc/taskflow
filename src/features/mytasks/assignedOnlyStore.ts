/** My Tasks "Assigned to me" preference, persisted in localStorage. Pure
 * read/write helpers so the toggle stays testable and the hook thin. */

const KEY = 'tf-mytasks-assigned-only';

/** Read the stored preference, defaulting to false (show all). */
export function readAssignedOnly(): boolean {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

/** Persist the chosen preference (best-effort). */
export function writeAssignedOnly(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}
