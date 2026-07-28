import { useState } from 'react';
import { projectColorVar } from '../projects/projectColors';
import { nextProjectColor } from '../projects/projectColors';
import type { LabelRecord } from '../../lib/dataClient';
import './labels.css';

/** Task-detail label editor: every label as a toggle chip (on = applied to this
 * task), plus an inline "new label" field. Toggle + create are delegated up. */
export function LabelPicker({
  registry,
  selectedIds,
  onToggle,
  onCreate,
}: {
  registry: LabelRecord[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onCreate: (input: { name: string; color: string }) => void;
}) {
  const [name, setName] = useState('');

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate({ name: trimmed, color: nextProjectColor(registry.length) });
    setName('');
  };

  return (
    <div className="label-picker" data-testid="label-picker">
      <div className="label-picker__options">
        {registry.map((label) => {
          const on = selectedIds.has(label.id);
          return (
            <button
              key={label.id}
              type="button"
              data-testid="label-option"
              className={on ? 'label-opt label-opt--on' : 'label-opt'}
              aria-pressed={on}
              style={{
                borderColor: projectColorVar(label.color),
                color: projectColorVar(label.color),
              }}
              onClick={() => onToggle(label.id)}
            >
              {label.name}
            </button>
          );
        })}
      </div>
      <input
        className="label-picker__new"
        data-testid="label-new-input"
        placeholder="New label…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
    </div>
  );
}
