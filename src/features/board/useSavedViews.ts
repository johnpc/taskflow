import { useCallback, useState } from 'react';
import { readViews, writeViews, addView, removeView, type SavedView } from './savedViewsStore';
import type { BoardFilter } from './taskFilter';

/** Saved filter views for a project, seeded from + persisted to localStorage.
 * `save` names the given filter; `remove` deletes by name. Applying a view is
 * the caller's job (it owns the filter state) — the hook just returns them. */
export function useSavedViews(projectId: string) {
  const [views, setViews] = useState<SavedView[]>(() => readViews(projectId));

  const persist = useCallback(
    (next: SavedView[]) => {
      writeViews(projectId, next);
      setViews(next);
    },
    [projectId],
  );

  const save = useCallback(
    (name: string, filter: BoardFilter) => persist(addView(readViews(projectId), name, filter)),
    [projectId, persist],
  );

  const remove = useCallback(
    (name: string) => persist(removeView(readViews(projectId), name)),
    [projectId, persist],
  );

  return { views, save, remove };
}
