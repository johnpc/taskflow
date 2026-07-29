/** My Tasks "Group by" preference (due date vs priority), persisted in
 * localStorage. Pure read/write helpers so the toggle stays unit-testable and
 * the hook thin. Mirrors the board's viewMode pattern. */

export type GroupMode = 'due' | 'priority';

const KEY = 'tf-mytasks-group';

/** Read the stored grouping, defaulting to 'due'. */
export function readGroupMode(): GroupMode {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === 'due' || raw === 'priority') return raw;
  } catch {
    /* storage unavailable — use the default */
  }
  return 'due';
}

/** Persist the chosen grouping (best-effort). */
export function writeGroupMode(mode: GroupMode): void {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* ignore */
  }
}
