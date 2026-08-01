import { StatusUpdates } from '../projects/StatusUpdates';
import { useStatusUpdates } from './useStatusUpdates';

/** Wires the project status-update history + composer into ProjectView. Split
 * out so that screen stays a thin composer under the line limit. */
export function StatusUpdatesRegion({ projectId }: { projectId: string }) {
  const { query, post } = useStatusUpdates(projectId);
  return (
    <StatusUpdates
      updates={query.data ?? []}
      busy={post.isPending}
      nowMs={Date.now()}
      onPost={(input) => post.mutate(input)}
    />
  );
}
