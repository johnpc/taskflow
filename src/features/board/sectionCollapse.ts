/** Per-section collapse preference for the List view, persisted in localStorage
 * keyed by section id. Pure read/write helpers so the toggle is unit-testable
 * and the hook stays thin. Mirrors the viewMode store. */

const key = (sectionId: string) => `tf-collapse-${sectionId}`;

/** Read a section's stored collapsed state, falling back to `fallback`. */
export function readCollapsed(sectionId: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key(sectionId));
    if (raw === 'true') return true;
    if (raw === 'false') return false;
  } catch {
    /* storage unavailable — use the fallback */
  }
  return fallback;
}

/** Persist a section's collapsed state (best-effort). */
export function writeCollapsed(sectionId: string, collapsed: boolean): void {
  try {
    localStorage.setItem(key(sectionId), collapsed ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}
