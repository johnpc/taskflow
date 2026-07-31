import { useQuery } from '@tanstack/react-query';
import { coverUrl } from './coverApi';
import type { TaskRecord } from '../../lib/dataClient';

/** The cover image at the top of a board card. Self-resolves the task's coverKey
 * to a signed URL (react-query dedupes per key). Renders nothing when the task
 * has no cover. */
export function CardCover({ task }: { task: Pick<TaskRecord, 'coverKey'> }) {
  const { data: url } = useQuery({
    queryKey: ['cover', task.coverKey],
    queryFn: () => coverUrl(task.coverKey),
    enabled: !!task.coverKey,
    staleTime: 5 * 60_000,
  });
  if (!url) return null;
  return <img className="task-card__cover" data-testid="task-cover" src={url} alt="" />;
}
