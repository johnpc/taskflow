import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBoard, ensureDefaultSections } from './boardApi';
import { groupTasksBySection } from './taskGrouping';
import { applyFilter, DEFAULT_FILTER, type BoardFilter } from './taskFilter';
import { createSection, renameSection, deleteSection } from './sectionsApi';
import { createTask, setTaskDone } from '../task/tasksApi';
import { useLabels } from '../labels/useLabels';

/** Board data for a project: loads sections + tasks, ensures default columns
 * exist, and exposes them grouped into columns (with the filter/sort applied)
 * plus the task mutations the board needs. All server state via react-query. */
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

  const addSection = useMutation({
    mutationFn: (name: string) =>
      createSection({ projectId, name, order: query.data?.sections.length ?? 0 }),
    onSuccess: invalidate,
  });

  const editSection = useMutation({
    mutationFn: (input: { id: string; name: string }) => renameSection(input.id, input.name),
    onSuccess: invalidate,
  });

  const removeSection = useMutation({
    mutationFn: (id: string) => deleteSection(id),
    onSuccess: invalidate,
  });

  const labels = useLabels().query.data ?? [];

  return { query, columns, addTask, toggleDone, addSection, editSection, removeSection, labels };
}
