import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCustomFields, createCustomField } from './customFieldsApi';

/** A project's custom-field definitions + an add mutation. The task detail reads
 * these to render editable field rows; values live on the task (customValues). */
export function useCustomFields(projectId: string) {
  const qc = useQueryClient();
  const key = ['custom-fields', projectId];
  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchCustomFields(projectId),
    enabled: !!projectId,
  });
  const fields = query.data ?? [];

  const add = useMutation({
    mutationFn: (name: string) => createCustomField({ projectId, name, order: fields.length }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { fields, add };
}
