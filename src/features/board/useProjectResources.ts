import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchResources, addResource, removeResource } from '../projects/projectResourcesApi';

/** A project's key-resource links + add/remove mutations. All server state via
 * react-query; the overview region reads these and the safeHref guard is applied
 * at render. */
export function useProjectResources(projectId: string) {
  const qc = useQueryClient();
  const key = ['project-resources', projectId];
  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchResources(projectId),
    enabled: !!projectId,
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const add = useMutation({
    mutationFn: (input: { title: string; url: string }) => addResource({ projectId, ...input }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeResource(id),
    onSuccess: invalidate,
  });

  return { query, add, remove };
}
