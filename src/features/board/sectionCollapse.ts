/** Reactive per-section collapse store for the board/list views, persisted in
 * localStorage keyed by section id. A tiny subscribe/notify layer lets a
 * "collapse all" toolbar drive every mounted section at once (via
 * useSyncExternalStore), while each section still toggles itself. Pure helpers
 * keep it unit-testable; the hook stays thin. Mirrors the viewMode store. */

const key = (sectionId: string) => `tf-collapse-${sectionId}`;

const listeners = new Set<() => void>();

/** Subscribe to any collapse change (for useSyncExternalStore). */
export function subscribeCollapse(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

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

function persist(sectionId: string, collapsed: boolean): void {
  try {
    localStorage.setItem(key(sectionId), collapsed ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}

/** Persist a section's collapsed state (best-effort) and notify subscribers. */
export function writeCollapsed(sectionId: string, collapsed: boolean): void {
  persist(sectionId, collapsed);
  listeners.forEach((l) => l());
}

/** Collapse/expand many sections at once, notifying subscribers once. */
export function setManyCollapsed(sectionIds: string[], collapsed: boolean): void {
  sectionIds.forEach((id) => persist(id, collapsed));
  listeners.forEach((l) => l());
}

/** True when every listed section is currently collapsed (fallback per id). */
export function areAllCollapsed(sectionIds: string[], defaultOpen: boolean): boolean {
  return sectionIds.length > 0 && sectionIds.every((id) => readCollapsed(id, !defaultOpen));
}
