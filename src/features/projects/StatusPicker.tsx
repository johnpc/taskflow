import { useState } from 'react';
import { STATUS_META, type ProjectStatus } from './projectStatus';
import './projects.css';

/** Sets a project's health: three status buttons + an optional note. The active
 * button re-clicks to clear (back to "no status"). Note commits on blur. Local
 * draft only; both changes delegate up to the parent mutation. */
export function StatusPicker({
  status,
  note,
  onChange,
}: {
  status?: string | null;
  note?: string | null;
  onChange: (next: { status: ProjectStatus | null; statusNote?: string }) => void;
}) {
  const [draft, setDraft] = useState(note ?? '');
  return (
    <div className="status-picker" data-testid="status-picker">
      <div className="status-picker__buttons" role="group" aria-label="Project status">
        {STATUS_META.map((m) => (
          <button
            key={m.value}
            type="button"
            className="status-picker__btn"
            data-testid={`status-set-${m.value}`}
            aria-pressed={status === m.value}
            style={{ ['--pill' as string]: `var(${m.colorVar})` }}
            onClick={() => onChange({ status: status === m.value ? null : m.value })}
          >
            {m.label}
          </button>
        ))}
      </div>
      {status && (
        <input
          className="status-picker__note"
          data-testid="status-note"
          placeholder="Add a status note…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() =>
            draft !== (note ?? '') &&
            onChange({ status: status as ProjectStatus, statusNote: draft })
          }
        />
      )}
    </div>
  );
}
