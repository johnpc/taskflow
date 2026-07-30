import { useCallback, useState } from 'react';
import { readGroupBy, writeGroupBy } from './groupByStore';
import type { GroupBy } from './listGrouping';

/** List-view group-by state for a project (Section / Assignee / Due / Priority),
 * seeded from + persisted to localStorage keyed by project id. */
export function useGroupBy(projectId: string) {
  const [groupBy, setGroupBy] = useState<GroupBy>(() => readGroupBy(projectId));

  const choose = useCallback(
    (next: GroupBy) => {
      writeGroupBy(projectId, next);
      setGroupBy(next);
    },
    [projectId],
  );

  return { groupBy, choose };
}
