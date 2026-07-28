import { projectColorVar } from '../projects/projectColors';
import type { LabelRecord } from '../../lib/dataClient';
import './labels.css';

/** A row of colored label chips. Presentational; the caller resolves which
 * labels to show (resolveLabels). Renders nothing when empty. */
export function LabelChips({ labels }: { labels: LabelRecord[] }) {
  if (labels.length === 0) return null;
  return (
    <span className="label-chips" data-testid="label-chips">
      {labels.map((label) => (
        <span
          key={label.id}
          className="label-chip"
          data-testid="label-chip"
          style={{
            color: projectColorVar(label.color),
            borderColor: projectColorVar(label.color),
          }}
        >
          {label.name}
        </span>
      ))}
    </span>
  );
}
