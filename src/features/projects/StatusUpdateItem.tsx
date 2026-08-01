import { StatusPill } from './StatusPill';
import { relativeTime } from '../task/relativeTime';
import type { StatusUpdateRecord } from '../../lib/dataClient';

/** One entry in the project status-update history: the health pill at the time,
 * author + relative timestamp, and the note. `nowMs` injected for determinism. */
export function StatusUpdateItem({ update, nowMs }: { update: StatusUpdateRecord; nowMs: number }) {
  const when = relativeTime(update.createdAt, nowMs);
  return (
    <li className="status-update" data-testid="status-update">
      <span className="status-update__meta">
        <StatusPill status={update.status} />
        <span className="status-update__author">{update.authorEmail ?? 'You'}</span>
        {when && <span className="status-update__time">{when}</span>}
      </span>
      {update.note && <p className="status-update__note">{update.note}</p>}
    </li>
  );
}
