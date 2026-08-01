import { useState } from 'react';
import { STATUS_META, type ProjectStatus } from './projectStatus';
import { StatusUpdateItem } from './StatusUpdateItem';
import type { StatusUpdateRecord } from '../../lib/dataClient';
import './projects.css';

/** Project status-update history (Asana): a composer to post a dated update
 * (pick health + a note) over a feed of past updates, newest first. Posting is
 * delegated up (it also sets the project's current status). `nowMs` injected. */
export function StatusUpdates({
  updates,
  busy,
  nowMs,
  onPost,
}: {
  updates: StatusUpdateRecord[];
  busy: boolean;
  nowMs: number;
  onPost: (input: { status: ProjectStatus; note: string }) => void;
}) {
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [note, setNote] = useState('');

  const submit = () => {
    if (!status) return;
    onPost({ status, note });
    setStatus(null);
    setNote('');
  };

  return (
    <section className="status-updates" data-testid="status-updates">
      <h2 className="status-updates__head">Status updates</h2>
      <div className="status-updates__composer" role="group" aria-label="Post a status update">
        <div className="status-picker__buttons">
          {STATUS_META.map((m) => (
            <button
              key={m.value}
              type="button"
              className="status-picker__btn"
              data-testid={`status-post-${m.value}`}
              aria-pressed={status === m.value}
              style={{ ['--pill' as string]: `var(${m.colorVar})` }}
              onClick={() => setStatus(status === m.value ? null : m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <textarea
          className="status-updates__note"
          data-testid="status-update-note"
          placeholder="What's the latest? (optional)"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          className="status-updates__post"
          data-testid="status-update-post"
          disabled={busy || !status}
          onClick={submit}
        >
          Post update
        </button>
      </div>
      <ul className="status-updates__list">
        {updates.map((u) => (
          <StatusUpdateItem key={u.id} update={u} nowMs={nowMs} />
        ))}
      </ul>
    </section>
  );
}
