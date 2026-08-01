import type { LabelRecord } from '../../lib/dataClient';

/** A reset-on-change `<select>` of labels for the bulk bar (used for both
 * "Add label…" and "Remove label…"). Renders nothing without labels. Fires the
 * chosen label id, then clears its own value so the same label can be picked
 * again. Presentational. */
export function LabelPickSelect({
  labels,
  placeholder,
  testid,
  onPick,
}: {
  labels: LabelRecord[];
  placeholder: string;
  testid: string;
  onPick: (labelId: string) => void;
}) {
  if (labels.length === 0) return null;
  return (
    <select
      className="selection-bar__move"
      data-testid={testid}
      aria-label={placeholder}
      value=""
      onChange={(e) => e.target.value && onPick(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {labels.map((l) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
