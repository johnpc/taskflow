import type { FocusBucket } from './groupByFocus';
import type { TaskRecord } from '../../lib/dataClient';

const BUCKETS: { value: FocusBucket; label: string }[] = [
  { value: 'NONE', label: 'Unsorted' },
  { value: 'TODAY', label: 'Today' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'LATER', label: 'Later' },
];

/** Small select to move a task between My Tasks focus buckets (Today/Upcoming/
 * Later). Shown per card only in focus mode; the change is delegated up. */
export function FocusBucketPicker({
  task,
  onChange,
}: {
  task: TaskRecord;
  onChange: (bucket: FocusBucket) => void;
}) {
  return (
    <select
      className="mytasks__bucket-select"
      data-testid="focus-bucket-select"
      aria-label={`Focus bucket for ${task.title}`}
      value={(task.myBucket as FocusBucket) ?? 'NONE'}
      onChange={(e) => onChange(e.target.value as FocusBucket)}
    >
      {BUCKETS.map((b) => (
        <option key={b.value} value={b.value}>
          {b.label}
        </option>
      ))}
    </select>
  );
}
