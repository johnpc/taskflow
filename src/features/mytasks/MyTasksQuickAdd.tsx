import { useState } from 'react';
import type { ProjectRecord } from '../../lib/dataClient';

/** Quick-add composer at the top of My Tasks: a title input + a project picker,
 * so you can capture a task without opening a project first. Defaults to the
 * first project; submits on Enter / the Add button. Local draft only; the
 * create is delegated up. Renders nothing until projects have loaded. */
export function MyTasksQuickAdd({
  projects,
  onAdd,
}: {
  projects: ProjectRecord[];
  onAdd: (input: { projectId: string; title: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  if (projects.length === 0) return null;
  const target = projectId || projects[0].id;

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ projectId: target, title: trimmed });
    setTitle('');
  };

  return (
    <div className="mytasks__quickadd" data-testid="mytasks-quickadd">
      <input
        className="mytasks__quickadd-input"
        data-testid="quickadd-title"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <select
        className="mytasks__quickadd-project"
        data-testid="quickadd-project"
        value={target}
        onChange={(e) => setProjectId(e.target.value)}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="mytasks__quickadd-btn"
        data-testid="quickadd-add"
        disabled={!title.trim()}
        onClick={submit}
      >
        Add
      </button>
    </div>
  );
}
