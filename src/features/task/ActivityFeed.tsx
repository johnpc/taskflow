import { useQuery } from '@tanstack/react-query';
import { fetchTaskEvents } from './taskEventsApi';
import { activityLabel } from './activityLabel';
import { relativeTime } from './relativeTime';

/** The task's activity feed: created / completed / reopened events, oldest
 * first, each with who + a relative time. Self-fetches (keyed by task id).
 * Renders nothing until there's at least one event. `nowMs` injected for
 * deterministic timestamps. */
export function ActivityFeed({ taskId, nowMs }: { taskId: string; nowMs: number }) {
  const { data: events } = useQuery({
    queryKey: ['task-events', taskId],
    queryFn: () => fetchTaskEvents(taskId),
    enabled: !!taskId,
  });
  if (!events || events.length === 0) return null;
  return (
    <section className="activity-feed" data-testid="activity-feed">
      <h2 className="subtasks__head">Activity</h2>
      <ul className="activity-feed__list">
        {events.map((e) => (
          <li key={e.id} className="activity-feed__item" data-testid="activity-item">
            <span>{activityLabel(e.kind, e.actorEmail)}</span>
            <span className="activity-feed__when">{relativeTime(e.createdAt, nowMs)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
