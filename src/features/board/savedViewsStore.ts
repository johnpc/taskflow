import type { BoardFilter } from './taskFilter';

/** A named, saved filter/sort/group configuration for a project. */
export interface SavedView {
  name: string;
  filter: BoardFilter;
}

/** Per-project saved views, persisted in localStorage. Pure read/write helpers +
 * pure add/remove so the hook stays thin and everything is unit-testable. */
const key = (projectId: string) => `tf-views-${projectId}`;

/** Read a project's saved views (empty on nothing stored / bad JSON). */
export function readViews(projectId: string): SavedView[] {
  try {
    const raw = localStorage.getItem(key(projectId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedView[]) : [];
  } catch {
    return [];
  }
}

/** Persist a project's saved views (best-effort). */
export function writeViews(projectId: string, views: SavedView[]): void {
  try {
    localStorage.setItem(key(projectId), JSON.stringify(views));
  } catch {
    /* ignore */
  }
}

/** Add or replace a view by name (trimmed); returns the new list. A blank name
 * is ignored (returns the list unchanged). */
export function addView(views: SavedView[], name: string, filter: BoardFilter): SavedView[] {
  const trimmed = name.trim();
  if (!trimmed) return views;
  const without = views.filter((v) => v.name !== trimmed);
  return [...without, { name: trimmed, filter }];
}

/** Remove a view by name; returns the new list. */
export function removeView(views: SavedView[], name: string): SavedView[] {
  return views.filter((v) => v.name !== name);
}
