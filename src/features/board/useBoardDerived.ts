import { useMemo } from 'react';
import { blockedIdSet } from '../task/dependencies';
import { subtaskProgressByParent } from '../task/subtaskProgress';
import type { TaskRecord } from '../../lib/dataClient';

/** Card facts derived purely from the full project task set (no extra fetch):
 * which tasks are blocked, and each parent's subtask completion. Split from
 * useBoard so that hub stays within the line limit. */
export function useBoardDerived(tasks: TaskRecord[] | undefined) {
  const blockedIds = useMemo(() => blockedIdSet(tasks ?? []), [tasks]);
  const subtaskProgress = useMemo(() => subtaskProgressByParent(tasks ?? []), [tasks]);
  return { blockedIds, subtaskProgress };
}
