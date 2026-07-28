/** Per-project view preference (board vs list), persisted in localStorage keyed
 * by project id. Defaults to the project's own `view` field, then 'BOARD'. Pure
 * helpers so the toggle logic is unit-testable and the hook stays thin. */

export type ViewMode = 'BOARD' | 'LIST';

const key = (projectId: string) => `tf-view-${projectId}`;

/** Read the stored view for a project, falling back to the project default. */
export function readViewMode(projectId: string, fallback: ViewMode = 'BOARD'): ViewMode {
  try {
    const raw = localStorage.getItem(key(projectId));
    if (raw === 'BOARD' || raw === 'LIST') return raw;
  } catch {
    /* storage unavailable — use the fallback */
  }
  return fallback;
}

/** Persist a project's chosen view (best-effort). */
export function writeViewMode(projectId: string, mode: ViewMode): void {
  try {
    localStorage.setItem(key(projectId), mode);
  } catch {
    /* ignore */
  }
}
