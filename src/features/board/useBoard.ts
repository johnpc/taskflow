import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBoard, ensureDefaultSections } from './boardApi';
import { groupTasksBySection } from './taskGrouping';
import { applyFilter, DEFAULT_FILTER, type BoardFilter } from './taskFilter';
import { reorderTasks } from './reorderTasks';
import { useSectionMutations } from './useSectionMutations';
import { createTask, setTaskDone, updateTask } from '../task/tasksApi';
import { useLabels } from '../labels/useLabels';
import type { TaskRecord } from '../../lib/dataClient';

/** Board data for a project: loads sections + tasks, ensures default columns
 * exist, and exposes them grouped into columns (with the filter/sort applied)
 * plus the task + section mutations the board needs. Section mutations live in
 * useSectionMutations to keep this hub small. All server state via react-query. */
export function useBoard(projectId: string, filter: BoardFilter = DEFAULT_FILTER) {
  const qc = useQueryClient();
  const key = ['board', projectId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const board = await fetchBoard(projectId);
      const sections = await ensureDefaultSections(projectId, board.sections);
      return { sections, tasks: board.tasks };
    },
    enabled: !!projectId,
  });

  const columns = useMemo(() => {
    if (!query.data) return [];
    const grouped = groupTasksBySection(query.data.sections, query.data.tasks);
    return grouped.map((col) => ({ ...col, tasks: applyFilter(col.tasks, filter) }));
  }, [query.data, filter]);

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const addTask = useMutation({
    mutationFn: (input: { sectionId: string; title: string; order: number }) =>
      createTask({ projectId, ...input }),
    onSuccess: invalidate,
  });

  const toggleDone = useMutation({
    mutationFn: (input: { id: string; done: boolean; now: string }) =>
      setTaskDone(input.id, input.done, input.now),
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: async (input: {
      columnTasks: TaskRecord[];
      taskId: string;
      direction: 'up' | 'down';
    }) => {
      const updates = reorderTasks(input.columnTasks, input.taskId, input.direction);
      await Promise.all(updates.map((u) => updateTask(u)));
    },
    onSuccess: invalidate,
  });

  const quickEdit = useMutation({
    mutationFn: (input: Parameters<typeof updateTask>[0]) => updateTask(input),
    onSuccess: invalidate,
  });

  const sections = useSectionMutations(projectId, query.data?.sections ?? [], invalidate);
  const labels = useLabels().query.data ?? [];

  return { query, columns, addTask, toggleDone, reorder, quickEdit, labels, ...sections };
}
