import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBoard } from '../board/boardApi';
import { setTaskDone } from '../task/tasksApi';
import { isDone } from '../task/taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Completed-tasks data for a project: the done top-level tasks (most-recently
 * completed first), plus a reopen mutation. Reuses the board fetch. */
export function useCompleted(projectId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['board', projectId],
    queryFn: () => fetchBoard(projectId),
    enabled: !!projectId,
  });

  const done = useMemo(() => {
    const tasks = (query.data?.tasks ?? []).filter((t) => !t.parentTaskId && isDone(t));
    return tasks.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  }, [query.data]);

  const reopen = useMutation({
    mutationFn: (input: { id: string; now: string }) => setTaskDone(input.id, false, input.now),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['board', projectId] }),
  });

  return { query, done, reopen };
}

export type { TaskRecord };
