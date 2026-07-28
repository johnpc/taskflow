import { useCallback, useEffect, useState } from 'react';
import { readViewMode, writeViewMode, type ViewMode } from './viewMode';

/** View-mode state for a project (board vs list). Seeds from the persisted
 * choice (or the project's default `view`), and persists + re-applies on change.
 * `projectDefault` re-seeds once it loads so a project's own default is honored
 * before the user has ever toggled. */
export function useViewMode(projectId: string, projectDefault?: ViewMode) {
  const [mode, setMode] = useState<ViewMode>(() => readViewMode(projectId, projectDefault));

  useEffect(() => {
    // Once the project's stored default arrives, adopt it if the user has no
    // explicit per-project choice yet (readViewMode returns the fallback then).
    if (projectDefault) setMode(readViewMode(projectId, projectDefault));
  }, [projectId, projectDefault]);

  const choose = useCallback(
    (next: ViewMode) => {
      writeViewMode(projectId, next);
      setMode(next);
    },
    [projectId],
  );

  return { mode, choose };
}
