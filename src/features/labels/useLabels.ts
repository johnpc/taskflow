import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLabel, fetchLabels } from './labelsApi';

/** The owner's label registry + a create mutation. All server state via
 * react-query; shared by the task-detail label picker and card chip rendering. */
export function useLabels() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['labels'], queryFn: fetchLabels });

  const create = useMutation({
    mutationFn: (input: { name: string; color: string }) => createLabel(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  });

  return { query, create };
}
